using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAM.Core.DTO.Response
{
    public class SectionTemplateByContractOutDTO
    {
        public Guid SectionTemplateId { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public int OrderNo { get; set; }
    }
}
