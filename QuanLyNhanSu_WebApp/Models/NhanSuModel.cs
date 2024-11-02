﻿using System; 
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QuanLyNhanSu_WebApp.Models
{
    public class NhanSuModel : CommonModel.CommonModel
    {
        public string Id { get; set; }
        public string MaNhanVien { get; set; }
        public string HoTen { get; set; }
        public string GioiTinh { get; set; }
        public string NgaySinh { get; set; }
        public string tblCategory_Que_TinhId { get; set; }
        public string tblCategory_Que_HuyenId { get; set; }
        public string DiaChi_Que { get; set; }
        public string tblCategory_HienTai_TinhId { get; set; }
        public string tblCategory_HienTai_HuyenId { get; set; }
        public string DiaChi_HienTai { get; set; }
        public string tbl_CompanyId { get; set; }
        public string tbl_CompanyName { get; set; }
        public string tbl_CoSoId { get; set; }
        public string tbl_CoSoName { get; set; }
        public string tbl_PhongBanId { get; set; }
        public string tbl_PhongBanName { get; set; }
        public string tbl_Category_ChucVuId { get; set; }
        public string tbl_Category_ChucVuName { get; set; }
        public string tbl_Category_DanTocId { get; set; }
        public string tbl_Category_HocVanId { get; set; }
        public string tbl_Category_TonGiaoId { get; set; }
        public long SoCCCD { get; set; }
        public string tblCategory_NoiCap_TinhId { get; set; }
        public string Email { get; set; }
        public long SDT { get; set; }
        public int TinhTrang { get; set; }
        public string NgayBatDauLamViec { get; set; } 

        public string TenPB { get; set; } 
        public string TenCS { get; set; } 
        public string TenTinh { get; set; } 
        public string ChucVuName { get; set; } 
    }
}