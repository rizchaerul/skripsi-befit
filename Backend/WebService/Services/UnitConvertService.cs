using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebService.Constants;

namespace WebService.Services
{
    public static class UnitConvertService
    {
        public static string ConvertUnitName(string unitConstant)
        {
            if (unitConstant == UnitConstants.Time)
            {
                return "Times";
            }

            if (unitConstant == UnitConstants.Calories)
            {
                return "Cal";
            }

            if (unitConstant == UnitConstants.Minute)
            {
                return "Minutes";
            }

            if (unitConstant == UnitConstants.DistanceKilometer)
            {
                return "KM";
            }

            if (unitConstant == UnitConstants.DistanceMeter)
            {
                return "Meter";
            }

            return "";
        }
    }
}
