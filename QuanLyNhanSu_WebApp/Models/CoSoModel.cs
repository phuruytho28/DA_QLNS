using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QuanLyNhanSu_WebApp.Models
{
    public class CoSoModel : CommonModel.CommonModel

    {
        public string Id { get; set; }
        public string TenCoSo { get; set; }
        public string tbl_CompanyId { get; set; }
        public string tbl_CompanyName { get; set; }
        public string tbl_NhanSuName { get; set; }
        public string DiaChi { get; set; }
        public string tbl_NhanSuId { get; set; } 
        public int TinhTrang { get; set; } 
    }
} 