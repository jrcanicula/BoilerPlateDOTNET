﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.DTO.Response
{
	public class UserProfileOutDTO
	{
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Company { get; set; }
		public string ImageURL { get; set; }
		public string Password { get; set; }
		public string Address { get; set; }
         
		public string Email { get; set; }
		public string ContactNo { get; set; }
		public string Position { get; set; }
		public string Country { get; set; }
	}
}
