packer {
  required_version = ">= 1.7"
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1.0.0"
    }
  }
}


variable "aws_access_key" {
  type        = string
  sensitive   = true
  description = "AWS Access Key"
  default     = env("PACKER_AWS_ACCESS_KEY")
}

variable "aws_secret_key" {
  type        = string
  sensitive   = true
  description = "AWS Secret Key"
  default     = env("PACKER_AWS_SECRET_KEY")
}

variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "AWS region to launch the instance in"
}

// variable "source_ami" {
//   type        = string
//   default     = "ami-08c40ec9ead489470"
//   description = "Source AMI ID for Debian 12"
// }

variable "demo_account_id" {
  type        = string
  sensitive   = true
  default   = "none"
  description = "AWS Demo Account"
}


variable "db_root_password" {
  type        = string
  sensitive   = true
  default   = env("PACKER_DB_ROOT_PASSWORD")
  description = "DB Password"
}

source "amazon-ebs" "example" {
  region        = var.aws_region
  source_ami_filter {
    filters = {
      name                = "debian-12-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
      architecture        = "x86_64"
    }
    most_recent = true
    owners      = ["aws-marketplace"]
  }
  instance_type = "t2.micro"
  ami_name = "csye6225_Gokul${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_users     = ["877555005716","544273504223"] # Sharing AMI with DEMO account
  ssh_username  = "admin"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

build {

provisioner "shell" {
  inline = [
    "echo $AWS_ACCESS_KEY_ID",
    "echo $AWS_SECRET_ACCESS_KEY"
  ]
}

  sources = ["source.amazon-ebs.example"]

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/home/admin/webapp.zip"
  }

  provisioner "shell" {
  inline = [
    "sudo apt-get update",
    "echo ${var.db_root_password}"
    "sudo apt-get install -y nodejs npm unzip mariadb-server",
    "sudo systemctl start mariadb",
    "sudo apt-get install -y expect",
    
    # Secure installation
    "echo -e '\\n\\N\\nY\\n${var.db_root_password}\\n${var.db_root_password}\\nN\\nN\\nN\\nY\\n' | sudo mysql_secure_installation",
    "echo -e '\\n\\N\\nY\\n${var.db_root_password}\\n${var.db_root_password}\\nN\\nN\\nN\\nY\\n' | sudo mysql_secure_installation"
    # Login to MariaDB and grant privileges
    "sudo mysql -uroot -p${var.db_root_password} -e \"GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' IDENTIFIED BY '${var.db_root_password}' WITH GRANT OPTION; FLUSH PRIVILEGES;\"",
    
    "pwd",
    "ls -a",
    "cd /home/admin",
    "pwd",
    "unzip webapp.zip -d webapp && cd webapp && npm install",
    "echo 'MYSQL_USER=root' > /home/admin/webapp/.env",
    "echo 'MYSQL_PASSWORD=${var.db_root_password}' >> /home/admin/webapp/.env",
    "echo 'MYSQL_HOST=127.0.0.1' >> /home/admin/webapp/.env",
    "echo 'MYSQL_PORT=3306' >> /home/admin/webapp/.env",
    "echo 'MYSQL_DATABASE=webapp' >> /home/admin/webapp/.env",
    "chown admin:admin /home/admin/webapp/.env" # Ensure that the 'admin' user owns the .env file
  ]
}

}