using System;
using System.Web;
using System.Web.Mvc;

namespace QuanLyNhanSu_WebApp.Filter
{
    public class CustomAuthorizeAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (HttpContext.Current.Session["RoleId"] == null)
            {
                // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
                System.Diagnostics.Debug.WriteLine("User is not logged in. Redirecting to LoginView.");
                filterContext.Result = new RedirectToRouteResult(
                    new System.Web.Routing.RouteValueDictionary(new { controller = "Login", action = "LoginView" })
                );
            }
            else
            {
                System.Diagnostics.Debug.WriteLine("User is logged in with RoleId: " + HttpContext.Current.Session["RoleId"]);
            }

            base.OnActionExecuting(filterContext);
        }
    }
}
