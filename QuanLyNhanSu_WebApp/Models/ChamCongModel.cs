using System;
using System.Collections.Generic;
using System.Linq;
using System.Web; 

namespace QuanLyNhanSu_WebApp.Models
{
    public class ChamCongModel : CommonModel.CommonModel
    {
        public string Id { get; set; }
        public int Ngay { get; set; }
        public int Thang { get; set; }
        public int Nam { get; set; }
        public string GioVao { get; set; }
        public string GioRa { get; set; }
        public string TongSoGio { get; set; }
        public long LuongTamTinh { get; set; }

        public long Thuong1 { get; set; }
        public long Thuong2 { get; set; }
        public long Thuong3 { get; set; }
        public long PhuCap1 { get; set; }
        public long PhuCap2 { get; set; }
        public long PhuCap3 { get; set; }
        public long KhoanTru1 { get; set; }
        public long KhoanTru2 { get; set; }
        public long KhoanTru3 { get; set; }
        public string TongGioLamThucTe { get; set; }
        public long TongLuongThucTe { get; set; }
        public int SoCongHDLD { get; set; }
        public long LuongThangHDLD { get; set; }
         
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
        public string tbl_Category_ChucVu_NguoiTaoId { get; set; }
        public string tbl_Category_ChucVu_NguoiTaoName { get; set; }

        public int TinhTrang { get; set; }
        public int RoleId { get; set; }

        public int TongNgayLamThucTe { get; set; }
        public long TongLuongTamThoiThucTe { get; set; }
    }
}
