const AppError = require('../utils/appError');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'sales.json');
const salesData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const getStates = (req, res) => {
    try{
        const states = [...new Set(salesData.map(sale => sale.State))];
        res.status(200).json({
            status: 'success',
            count: states.length,
            data: states.sort()
        });
    } catch (error) {
        const appError = new AppError('Failed to fetch states', 500);
        console.error('Error fetching states:', error);
        return res.status(appError.statusCode).json({ error: appError.message });
    }
};

const getDateRangeByState = (req, res) => {
    try{
        const state = req.params.state;
        const filteredSalesData = salesData.filter(sale => sale.State.toLowerCase() === state.toLowerCase());
        //const minDate = Math.min(...filteredSalesData.map(sale => new Date(sale["Order Date"])));
        //const maxDate = Math.max(...filteredSalesData.map(sale => new Date(sale["Order Date"])));
        
        let minDate = Infinity;
        let maxDate = -Infinity;

        for (const sale of salesData) {
            if (sale.State.toLowerCase() === state.toLowerCase()) {
                const date = new Date(sale["Order Date"]).getTime();

                if (date < minDate) minDate = date;
                if (date > maxDate) maxDate = date;
            }
        }
        
        res.status(200).json({
            status: 'success',
            data: {
                state,
                dateRange: {
                    min: minDate,
                    max: maxDate
                }
            }
        });
    } catch (error) {
        console.error('Error fetching date range:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const dashboardData = (req, res) => {
    try{
        const {state, minDate, maxDate} = req.query;
        const customerId = req.headers['x-customer-id'];

        if(!state || !minDate || !maxDate){
            return res.status(400).json({ error: 'Missing required query parameters: state, minDate, maxDate' });
        }

        const min = new Date(Number(minDate));
        const max = new Date(Number(maxDate));
        const filteredSalesData = salesData.filter(item => {
            const orderDate = new Date(item["Order Date"]);

            if (isNaN(orderDate)) return false;

            return item.State.toLowerCase().trim() === state.toLowerCase().trim() &&
                   orderDate >= min &&
                   orderDate <= max;
        })

        if (!filteredSalesData.length) {
            return res.json({
                status: "success",
                message: "No data found",
                data: {}
            });
        }

        /* =========================
        CARDS DATA
        ========================== */
        let totalSales = 0;
        let totalProfit = 0;
        let totalQuantity = 0;
        let totalDiscount = 0;

        const orderSet = new Set();

        /* =========================
        MAPS FOR CHARTS
        ========================== */
        const categoryMap = {};
        const subCategoryMap = {};
        const cityMap = {};
        const productMap = {};
        const segmentMap = {};

        filteredSalesData.forEach(item => {
            // CARDS
            totalSales += item.Sales;
            totalProfit += item.Profit;
            totalQuantity += item.Quantity;
            totalDiscount += item.Discount;
            orderSet.add(item["Order ID"]);

            // CATEGORY
            categoryMap[item.Category] = (categoryMap[item.Category] || 0) + item.Sales;

            // SUB-CATEGORY
            subCategoryMap[item["Sub-Category"]] =
                (subCategoryMap[item["Sub-Category"]] || 0) + item.Sales;

            // CITY
            cityMap[item.City] = (cityMap[item.City] || 0) + item.Sales;

            // PRODUCT
            productMap[item["Product Name"]] =
                (productMap[item["Product Name"]] || 0) + item.Sales;

            // SEGMENT
            segmentMap[item.Segment] =
                (segmentMap[item.Segment] || 0) + item.Sales;
        });

        //console.log(categoryMap)

        const formatChart = (map, keyName) => {
            return Object.keys(map).map(key => ({
                [keyName]: key,
                sales: Number(map[key].toFixed(2))
            })).sort((a, b) => b.sales - a.sales);
        };

        res.json({
            status: "success",
            filters: { customerId, state, minDate, maxDate },

            cards: {
                totalSales: Number(totalSales.toFixed(2)),
                totalProfit: Number(totalProfit.toFixed(2)),
                totalQuantity,
                totalOrders: orderSet.size,
                totalDiscount: Number(totalDiscount.toFixed(2)) 
            },

            charts: {
                salesByCategory: formatChart(categoryMap, "category"),
                salesBySubCategory: formatChart(subCategoryMap, "subCategory"),
                salesByCity: formatChart(cityMap, "city"),               
                salesByProduct: formatChart(productMap, "product"),      
                salesBySegment: formatChart(segmentMap, "segment")      
            }
        });

    } catch(error){
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getStates,
    getDateRangeByState,
    dashboardData
};