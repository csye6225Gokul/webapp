packer {
  required_version = ">= 1.7"
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = "~> 1"
    }
  }
}

# variable "aws_access_key" {
#   type      = string
#   sensitive = true
# }

# variable "aws_secret_key" {
#   type      = string
#   sensitive = true
# }

variable "db_root_password" {
  type      = string
  sensitive = true
}

locals {
  timestamp = regex_replace(timestamp(), "[- TZ:]", "")
}

source "amazon-ebs" "debian_base" {
  # access_key = var.aws_access_key
  # secret_key = var.aws_secret_key
  # profile    = "dev"
  region = "us-east-1"
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
  instance_type   = "t2.micro"
  ssh_username    = "admin"
  ami_users       = ["271179972962", "397514698882"]
  ami_name        = "custom-debian-Raj-ami-${local.timestamp}"
  ami_description = "Hariharan AMI with Node.js, NPM, and MariaDB installed"
}

build {
  sources = [
    "source.amazon-ebs.debian_base"
  ]

  provisioner "shell" {
    inline = [
      "sudo apt update",
      "sudo apt install -y nodejs npm",
      "sudo apt-get install unzip",
      "sudo apt install -y mariadb-server",
      "sudo systemctl enable mariadb",
      "sudo systemctl start mariadb",
      "sudo apt-get install -y expect",
      "echo -e '\\n\\N\\nY\\n${var.db_root_password}\\n${var.db_root_password}\\nN\\nN\\nN\\nY\\n' | sudo mysql_secure_installation"
    ]
  }

  provisioner "file" {
    source      = "/home/runner/work/webapp/webapp/repository.zip"
    destination = "~/"
  }

  provisioner "shell" {
    inline = [
      "unzip ~/repository.zip -d ~/webapp",
      "cd ~/webapp && npm install",
    ]
  }

}