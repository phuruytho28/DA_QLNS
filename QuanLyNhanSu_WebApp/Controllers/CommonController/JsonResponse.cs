using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QuanLyNhanSu_WebApp.Controllers.CommonController
{
    public class JsonResponse
    { 
        public bool Success { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
        public string RedirectUrl { get; internal set; }
        public string NewId { get; set; }
    }

}