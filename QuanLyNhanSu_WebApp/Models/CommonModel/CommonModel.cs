using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QuanLyNhanSu_WebApp.Models.CommonModel
{
    public class CommonModel
    {
        public int StatusId { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedDateView { get; set; }
        public string CreatedBy { get; set; }
        public string ModifyDate { get; set; }
        public string ModifyBy { get; set; }
        public string Note { get; set; }
        public string C1 { get; set; }
        public string C2 { get; set; }
        public string C3 { get; set; }


        public string Keyword { get; set; }
        public int pageIndex { get; set; }
        public int pageSize { get; set; }
        public int totalRows { get; set; }
        public long RowNum { get; set; }
    }
}