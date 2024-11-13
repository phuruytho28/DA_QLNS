using System;
using System.Collections.Generic;
using System.Linq;
using System.Web; 

namespace QuanLyNhanSu_WebApp.Models
{
    public class HDLD_lstBangLuongModel : CommonModel.CommonModel
    {
        public string Id { get; set; }
        public string MaHD { get; set; }
        public int LoaiHD { get; set; }
        public string TenHD { get; set; }
        public string NgayTaoHD { get; set; }
        public string NgayKyHD { get; set; }
        public long MucLuongKyHD { get; set; }
        public long MucTienBH { get; set; }
        public int SoCongHangThang { get; set; }

        public string tbl_CompanyId { get; set; }
        public string tbl_CompanyName { get; set; }
        public string tbl_CoSoId { get; set; }
        public string tbl_CoSoName { get; set; }
        public string tbl_PhongBanId { get; set; }
        public string tbl_PhongBanName { get; set; }
        public string tbl_NhanSuId { get; set; }
        public string tbl_NhanSuName { get; set; }
        public string tbl_Category_ChucVuId { get; set; }
        public string tbl_Category_ChucVuName { get; set; }
        public string tbl_Category_ChucVu_NhanSuId { get; set; }
        public string tbl_Category_ChucVu_NhanSuName { get; set; }
         
        public int TinhTrang { get; set; }
        public int RoleId { get; set; }
        public string MoTaChiTiet { get; set; } 
    }
}
