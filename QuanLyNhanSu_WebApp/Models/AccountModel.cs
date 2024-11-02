using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Xml.Linq;

namespace QuanLyNhanSu_WebApp.Models
{
    public class AccountModel : CommonModel.CommonModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string HasPassword { get; set; }
        public int RoleId { get; set; }
        public string Gmail { get; set; }
        public string CompanyId { get; set; }


        /// đây là phần của bảng Company
        public string TenCongTy { get; set; }
        public string DiaChi { get; set; }
        public string SoDienThoai { get; set; }
    }
}
 