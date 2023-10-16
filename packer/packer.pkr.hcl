packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1"
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

variable "source_ami" {
  type        = string
  default     = "ami-08c40ec9ead489470"
  description = "Source AMI ID for Debian 12"
}

variable "demo_account_id" {
  type        = string
  sensitive   = true
  default   = "none"
  description = "AWS Demo Account"
}


variable "db_root_password" {
  type        = string
  sensitive   = true
  default   = "none"
  description = "DB Password"
}

source "amazon-ebs" "example" {
  region        = var.aws_region
  //source_ami    = var.source_ami
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
  ami_users     = [var.demo_account_id] # Sharing AMI with DEMO account
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
    "sudo apt-get install -y nodejs npm unzip mariadb-server",
    "sudo systemctl start mariadb",
    "sudo apt-get install -y expect",
    "echo -e '\\n\\N\\nY\\n${var.db_root_password}\\n${var.db_root_password}\\nN\\nN\\nN\\nY\\n' | sudo mysql_secure_installation",
    "cd /home/admin && unzip webapp.zip -d webapp && cd webapp && npm install"
  ]
  }
}
