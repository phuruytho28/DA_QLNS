using System; 
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QuanLyNhanSu_WebApp.Models
{
    public class TuyenDungModel : CommonModel.CommonModel
    {
        public string Id { get; set; }
        public string MaTuyenDung { get; set; }
        public string TenTuyenDung { get; set; }
        public string MoTa { get; set; }
        public string YeuCau { get; set; }
        public string tbl_CompanyId { get; set; }
        public string tbl_CompanyName { get; set; }
        public string tbl_CoSoId { get; set; }
        public string tbl_CoSoName { get; set; }
        public string tbl_PhongBanId { get; set; }
        public string tbl_PhongBanName { get; set; }
        public string tbl_Category_ChucVuId { get; set; }
        public string tbl_Category_ChucVuName { get; set; }
        public string tbl_NhanSuPhuTrachId { get; set; }
        public string tbl__NhanSuPhuTrachName { get; set; }
        public int SoLuong { get; set; }
        public int MucLuongTu { get; set; }
        public int MucLuongDen { get; set; }
        public int MucLuong { get; set; }
        public string LinkTuyenDung { get; set; }
        public string NgayBatDau { get; set; }
        public string HanNopHoSo { get; set; }
        public string NgayKetThuc { get; set; } 
        public int TinhTrang { get; set; }
        public int TinhTrangHoSoTD { get; set; } 

    }
}
