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

source "amazon-ebs" "example" {
  region        = var.aws_region
  source_ami    = var.source_ami
  instance_type = "t2.micro"
  ami_name = "csye6225_Gokul${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_users     = [var.demo_account_id] # Sharing AMI with DEMO account
  ssh_username  = "debian"
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
    destination = "/home/debian/webapp.zip"
  }

  provisioner "shell" {
    inline = [
    "sudo apt-get update",
    "sudo apt-get install -y nodejs npm unzip mariadb-server",
    "sudo mysql -e \"ALTER USER 'root'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY 'msdIndu@99'; FLUSH PRIVILEGES;\"",
    "cd /home/debian && unzip webapp.zip -d webapp && cd webapp && npm install"
  ]
  }
}
