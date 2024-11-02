using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Xml.Linq;

namespace QuanLyNhanSu_WebApp.Models
{
    public class CompanyModel : CommonModel.CommonModel
    {
        public string Id { get; set; }
        public string TenCongTy { get; set; }
        public string MaCongTy { get; set; }
        public string tbl_AccountId { get; set; }
        public string DiaChi { get; set; }
        public string SoDienThoai { get; set; } 
        public string CompanyId { get; set; }
    }
}
 