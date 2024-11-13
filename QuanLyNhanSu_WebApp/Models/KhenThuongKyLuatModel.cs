using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QuanLyNhanSu_WebApp.Models
{
    public class KhenThuongKyLuatModel : CommonModel.CommonModel
    {
        public string Id { get; set; }
        public string MaKT_KL { get; set; }
        public string TenKTKL { get; set; }
        public string MoTaChiTiet { get; set; }
        public string NgayKhoiTao { get; set; }
        public int HinhThuc { get; set; }
        public string SoQuyetDinh { get; set; }
        public string NgayQuyetDinh { get; set; }
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
        public int TinhTrang { get; set; }
        public int RoleId { get; set; } 
    }
}
