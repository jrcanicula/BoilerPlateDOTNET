using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.Utils
{
    public static class UriExtensions
    {
        public static string GetSubDomain(this Uri url)
        {
            if (url.HostNameType == UriHostNameType.Dns)
            {
                string host = url.Host;

                if (host.Split('.').Length > 2)
                {
                    int lastIndex = host.LastIndexOf(".");
                    int index = host.LastIndexOf(".", lastIndex - 1);

                    return host.Substring(0, index).ToLower();
                }
            }

            return string.Empty;
        }

    }
}
