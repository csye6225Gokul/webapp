packer {
  required_version = ">= 1.7"
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1.0.0"
    }
  }
}


// variable "aws_access_key" {
//   type        = string
//   sensitive   = true
//   description = "AWS Access Key"
//   default     = env("PACKER_AWS_ACCESS_KEY")
// }

// variable "aws_secret_key" {
//   type        = string
//   sensitive   = true
//   description = "AWS Secret Key"
//   default     = env("PACKER_AWS_SECRET_KEY")
// }

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
  default     = env("demo_account_id")
  description = "AWS Demo Account"
}

variable "dev_account_id" {
  type        = string
  sensitive   = true
  default     = env("dev_account_id")
  description = "AWS Demo Account"
}


variable "db_root_password" {
  type        = string
  sensitive   = true
  default     = env("PACKER_DB_ROOT_PASSWORD")
  description = "DB Password"
}

source "amazon-ebs" "example" {
  region = var.aws_region
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
  ami_name      = "csye6225_Gokul${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_users     = [var.dev_account_id, var.demo_account_id] # Sharing AMI with DEMO account
  ssh_username  = "admin"
  //   access_key = var.aws_access_key
  //   secret_key = var.aws_secret_key
}

build {

  provisioner "shell" {
    inline = [
      "echo $AWS_ACCESS_KEY_ID",
      "echo $AWS_SECRET_ACCESS_KEY",
      "sudo groupadd csye6225",
      "sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225"
    ]
  }

  sources = ["source.amazon-ebs.example"]

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/home/admin/webapp.zip"
  }

  // provisioner "file" {
  //   source      = "webapp.zip"
  //   destination = "/opt/webapp.zip"
  // }

  provisioner "file" {
    source      = "/home/runner/work/webapp/webapp/csye6225.service"
    destination = "/home/admin/csye6225.service"
  }


  provisioner "shell" {
    inline = [
      "sudo mv /home/admin/csye6225.service /etc/systemd/system/csye6225.service",
      // "sudo mv /home/admin/webapp.zip /opt/webapp.zip",
      "sudo chmod 644 /etc/systemd/system/csye6225.service",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable csye6225.service",
      "sudo systemctl start csye6225.service"
    ]
  }


  provisioner "shell" {
    inline = [
      "sudo sh -c 'echo \"first_name,last_name,email,password\" > /opt/users.csv'",
      "sudo sh -c 'echo \"john,doe,john.doe@example.com,abc123\" >> /opt/users.csv'",
      "sudo sh -c 'echo \"jane,doe,jane.doe@example.com,xyz456\" >> /opt/users.csv'",
      "sudo sh -c 'echo \"vivek,hana,vivek.hana@gmail.com,vivek123\" >> /opt/users.csv'",
      "sudo sh -c 'echo \"sara,john,sara.john@gmail.com,sara123\" >> /opt/users.csv'"
    ]
  }


  provisioner "shell" {
    inline = [
      "sudo apt-get update",
      "echo ${var.db_root_password}",
      "sudo apt-get install -y nodejs npm unzip",
      // "sudo systemctl start mariadb",
      "sudo apt-get install cloud-init",
      "sudo apt-get install -y expect",

      // # Secure installation
      // "echo -e '\\n\\N\\nY\\n${var.db_root_password}\\n${var.db_root_password}\\nN\\nN\\nN\\nY\\n' | sudo mysql_secure_installation",
      // # Login to MariaDB and grant privileges
      // "sudo mysql -uroot -p${var.db_root_password} -e \"GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' IDENTIFIED BY '${var.db_root_password}' WITH GRANT OPTION; FLUSH PRIVILEGES;\"",

      "pwd",
      "ls -a",
      "cd /home/admin",
      "ls -a",
      "pwd",
      "sudo unzip webapp.zip -d /opt/webapp",
      "cd /opt/webapp",
      "npm install",
      "sudo chown csye6225:csye6225 -R /opt/webapp",
      "sudo chmod g+x server.js"
      // "echo 'MYSQL_USER=root' > /home/admin/webapp/.env",
      // "echo 'MYSQL_PASSWORD=${var.db_root_password}' >> /home/admin/webapp/.env",
      // "echo 'MYSQL_HOST=127.0.0.1' >> /home/admin/webapp/.env",
      // "echo 'MYSQL_PORT=3306' >> /home/admin/webapp/.env",
      // "echo 'MYSQL_DATABASE=webapp' >> /home/admin/webapp/.env",
      // "chown admin:admin /home/admin/webapp/.env" # Ensure that the 'admin' user owns the .env file
    ]
  }


  provisioner "shell" {
    inline = [
      "sudo apt-get purge -y git"
    ]
  }

  // provisioner "shell" {
  //   inline = [
  //     "cd ~"
  //     "systemctl daemon-reload",
  //     "systemctl enable csye6225"
  //   ]
  // }  


}