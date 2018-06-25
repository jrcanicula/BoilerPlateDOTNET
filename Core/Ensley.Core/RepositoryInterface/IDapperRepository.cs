using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Ensley.Core.RepositoryInterface
{
    public interface IDapperRepository<T> where T : class
    {
        Guid Add(T item, bool tableWithTrigger = false);
        Task AddAsync(T item);
        void Remove(Guid Id);
        void Update(T item);
        T FindByID(Guid id);
        TY FindByID<TY>(Guid id) where TY : class;
        IEnumerable<T> Find(Expression<Func<T, bool>> predicate);
        IEnumerable<T> FindAll();    
        IEnumerable<TY> FindAll<TY>() where TY : class;       
    }
}
