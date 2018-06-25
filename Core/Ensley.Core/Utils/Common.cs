using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.Utils
{
	public static class Common
	{
		public static string ConfigConnectionString { get; set; }

		public static string Environment { get; set; }

		public static string EncodeHTML(string value)
		{
			return WebUtility.HtmlEncode(value);
		}

		public static string DecodeHTML(string value)
		{
			return WebUtility.HtmlDecode(value);
		}

		public static string GetSubDomainByContextRequest(HttpContext context)
		{
			var request = context.Request;
			var absoluteUri = string.Concat(
									request.Scheme,
									"://",
									request.Host.ToUriComponent(),
									request.PathBase.ToUriComponent(),
									request.Path.ToUriComponent(),
									request.QueryString.ToUriComponent());

			var subdomain = new Uri(absoluteUri).GetSubDomain();

			if (String.IsNullOrEmpty(subdomain))
			{
				return "samprime";
			}

			return subdomain;
		}
	}
}
