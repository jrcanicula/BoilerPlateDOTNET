using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ensley.Web.Filters
{
    public class ValidateDataModelAttribute : ActionFilterAttribute
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        public ValidateDataModelAttribute(IHostingEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            // temporary for nullable
            context.ModelState.Remove("contractid");
            context.ModelState.Remove("contracttagid");

            if (!context.ModelState.IsValid)
            {      
                if (_hostingEnvironment.IsDevelopment())
                {
                    throw new Exception("Modal Binder issue");
                }
                else
                {
                    context.Result = new BadRequestObjectResult(context.ModelState); // it returns 400 with the error
                }
            }
        }
    }
}
