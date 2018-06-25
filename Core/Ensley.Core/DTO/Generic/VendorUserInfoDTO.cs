﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.DTO.Generic
{
	public class VendorUserInfoDTO
	{
		public Guid? UserInfoId { get; set; }

		public string FirstName { get; set; }

		public string LastName { get; set; }

		public string Email { get; set; }

		public string ContactNo { get; set; }

		public string Address { get; set; }

		public string Position { get; set; }

		public string Country { get; set; }

		public int Type { get; set; }
	}
}
