/*
' THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
' TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
' THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
' CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
' DEALINGS IN THE SOFTWARE.
*/
using DotNetNuke.Security;
using DotNetNuke.Web.Api;
using DotNetNuke.Web.Mvc.Framework.ActionFilters;
using System.Web.Mvc;
using System.Collections.Generic;

namespace <%= namespace%>.Modules.<%= moduleName %>.Controllers
{
    [SupportedModules(FeatureController.MODULENAME)]
    [DnnModuleAuthorize(AccessLevel = SecurityAccessLevel.View)]
    [DnnHandleError]
    public class DataController : DnnApiController
    {
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public HttpResponseMessage GetList()
        {
            return Request.CreateResponse(HttpStatusCode.OK, new List<string>());
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public HttpResponseMessage Get(int itemId)
        {
            return Request.CreateResponse(HttpStatusCode.OK, "Item " + itemId.ToString());
        }
    }
}