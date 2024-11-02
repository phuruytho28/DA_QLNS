using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QuanLyNhanSu_WebApp.Models
{
    public class PhongBanModel : CommonModel.CommonModel
    {
        public string Id { get; set; }
        public string TenPhongBan { get; set; }
        public string MaPhongBan { get; set; }
        public string tbl_CompanyId { get; set; }
        public string tbl_CompanyName { get; set; }
        public string tbl_CoSoId { get; set; }
        public string tbl_CoSoName { get; set; }
        public string tbl_NhanSuId { get; set; }
        public string tbl_NhanSuName { get; set; }
        public int TinhTrang { get; set; }
    }
}
