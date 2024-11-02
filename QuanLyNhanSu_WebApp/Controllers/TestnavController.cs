using QuanLyNhanSu_WebApp.Filter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QuanLyNhanSu_WebApp.Controllers
{
    [CustomAuthorize]
    public class TestnavController : Controller
    {
        // GET: Testnav
        public ActionResult TestnavView()
        {
            return View();
        }
    }
}