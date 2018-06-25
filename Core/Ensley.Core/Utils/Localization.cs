using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.Common
{
    public static class Localization
    {
        public static Dictionary<string, string> GetCultures()
        {
            Dictionary<string, string> locales = new Dictionary<string, string>();

            foreach (var c in CultureInfo.GetCultures(CultureTypes.AllCultures))
            {
                if (!locales.ContainsKey(c.Name))
                {
                    locales.Add(c.Name, c.DisplayName);
                }
            }

            return locales;
        }
        public static DateTime ConvertUTCToTimeZoneDate(DateTime fromUTCDate, string toTimeZoneId)
        {
            var toTimeZone = TimeZoneInfo.FindSystemTimeZoneById(toTimeZoneId);
            return TimeZoneInfo.ConvertTimeFromUtc(fromUTCDate, toTimeZone);
        }

        public static DateTime GetUTCDateNow()
        {
            return DateTime.UtcNow;
        }
    }
}
