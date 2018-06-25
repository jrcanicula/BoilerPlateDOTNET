using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

namespace Ensley.Core.Extensions.Wrapper
{
    ///Code DynamicQuery reference from  https://github.com/bbraithwaite/RepoWrapper/blob/master/DynamicQuery.cs
    public sealed class DynamicQuery
    {
        /// <summary>
        /// Gets the insert query.
        /// </summary>
        /// <param name="tableName">Name of the table.</param>
        /// <param name="item">The item.</param>
        /// <returns>
        /// The Sql query based on the item properties.
        /// </returns>
        public static string GetInsertQuery(string tableName, string primaryIdName, dynamic item, bool tableWithTrigger = false, bool withPrimaryId = false)
        {
            PropertyInfo[] props = item.GetType().GetProperties();
            string[] columns = props.Select(p => string.Format("[{0}]", p.Name)).ToArray();
            string[] columnProperties = props.Select(p => p.Name).ToArray();
            if (!withPrimaryId)
            {
                columns = props.Where(s => s.Name != primaryIdName).Select(p => string.Format("[{0}]", p.Name)).ToArray();
                columnProperties = props.Select(p => p.Name).Where(s => s != primaryIdName).ToArray();
            }

            Guid id = Guid.NewGuid();
            if (tableWithTrigger)
            {
                return string.Format("INSERT INTO {0} ({3},{1}) VALUES ('{4}',@{2})",
                                 tableName,
                                 string.Join(",", columns),
                                 string.Join(",@", columnProperties),
                                 primaryIdName,
                                 id.ToString());
            }
            else if (withPrimaryId)
            {
                return string.Format("INSERT INTO {0} ({1}) VALUES (@{2})",
                                 tableName,
                                 string.Join(",", columns),
                                 string.Join(",@", columnProperties));
            }
            else
            {
                return string.Format("INSERT INTO {0} ({3},{1}) OUTPUT inserted.{3} VALUES ('{4}',@{2})",
                                 tableName,
                                 string.Join(",", columns),
                                 string.Join(",@", columnProperties),
                                 primaryIdName,
                                 id.ToString());
            }

        }

        /// <summary>
        /// Gets the update query.
        /// </summary>
        /// <param name="tableName">Name of the table.</param>
        /// <param name="item">The item.</param>
        /// <returns>
        /// The Sql query based on the item properties.
        /// </returns>
        public static string GetUpdateQuery(string tableName, string primaryIdName, dynamic item)
        {
            PropertyInfo[] props = item.GetType().GetProperties();
            string[] columns = props.Select(p => p.Name).ToArray();

            var parameters = columns.Select(name => string.Format("[{0}]", name) + "=@" + name).ToList();

            return string.Format("UPDATE {0} SET {1} WHERE {2}=@{2}", tableName, string.Join(",", parameters), primaryIdName);
        }

        /// <summary>
        /// Gets the dynamic query.
        /// </summary>
        /// <param name="tableName">Name of the table.</param>
        /// <param name="expression">The expression.</param>
        /// <returns>A result object with the generated sql and dynamic params.</returns>
        public static QueryResult GetDynamicQuery<T>(string tableName, Expression<Func<T, bool>> expression)
        {
            var queryProperties = new List<QueryParameter>();
            var body = (BinaryExpression)expression.Body;
            IDictionary<string, Object> expando = new ExpandoObject();
            var builder = new StringBuilder();

            // walk the tree and build up a list of query parameter objects
            // from the left and right branches of the expression tree
            WalkTree(body, ExpressionType.Default, ref queryProperties);

            // convert the query parms into a SQL string and dynamic property object
            builder.Append("SELECT * FROM ");
            builder.Append(tableName);
            builder.Append(" WHERE ");

            for (int i = 0; i < queryProperties.Count(); i++)
            {
                QueryParameter item = queryProperties[i];

                if (!string.IsNullOrEmpty(item.LinkingOperator) && i > 0)
                {
                    builder.Append(string.Format("{0} {1} {2} @{1}{3} ", item.LinkingOperator, item.PropertyName,
                                                 item.QueryOperator, i));
                }
                else
                {
                    builder.Append(string.Format("{0} {1} @{0}{2} ", item.PropertyName, item.QueryOperator, i));
                }

                expando[item.PropertyName + i.ToString()] = item.PropertyValue;
            }

            return new QueryResult(builder.ToString().TrimEnd(), expando);
        }

        /// <summary>
        /// Walks the tree.
        /// </summary>
        /// <param name="body">The body.</param>
        /// <param name="linkingType">Type of the linking.</param>
        /// <param name="queryProperties">The query properties.</param>
        private static void WalkTree(BinaryExpression body, ExpressionType linkingType,
                                     ref List<QueryParameter> queryProperties)
        {
            if (body.NodeType != ExpressionType.AndAlso && body.NodeType != ExpressionType.OrElse)
            {
                string propertyName = GetPropertyName(body);
                dynamic propertyValue = body.Right;
                string opr = GetOperator(body.NodeType);
                string link = GetOperator(linkingType);

                queryProperties.Add(new QueryParameter(link, propertyName, propertyValue.Value, opr));
            }
            else
            {
                WalkTree((BinaryExpression)body.Left, body.NodeType, ref queryProperties);
                WalkTree((BinaryExpression)body.Right, body.NodeType, ref queryProperties);
            }
        }

        /// <summary>
        /// Gets the name of the property.
        /// </summary>
        /// <param name="body">The body.</param>
        /// <returns>The property name for the property expression.</returns>
        private static string GetPropertyName(BinaryExpression body)
        {
            string propertyName = body.Left.ToString().Split(new char[] { '.' })[1];

            if (body.Left.NodeType == ExpressionType.Convert)
            {
                // hack to remove the trailing ) when convering.
                propertyName = propertyName.Replace(")", string.Empty);
            }

            return propertyName;
        }

        /// <summary>
        /// Gets the operator.
        /// </summary>
        /// <param name="type">The type.</param>
        /// <returns>
        /// The expression types SQL server equivalent operator.
        /// </returns>
        /// <exception cref="System.NotImplementedException"></exception>
        private static string GetOperator(ExpressionType type)
        {
            switch (type)
            {
                case ExpressionType.Equal:
                    return "=";
                case ExpressionType.NotEqual:
                    return "!=";
                case ExpressionType.LessThan:
                    return "<";
                case ExpressionType.GreaterThan:
                    return ">";
                case ExpressionType.AndAlso:
                case ExpressionType.And:
                    return "AND";
                case ExpressionType.Or:
                case ExpressionType.OrElse:
                    return "OR";
                case ExpressionType.Default:
                    return string.Empty;
                default:
                    throw new NotImplementedException();
            }
        }
    }
}
