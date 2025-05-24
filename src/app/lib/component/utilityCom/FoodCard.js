import Link from "next/link";

 
const FoodCard = ({ items }) => {
   

  return (
    <div className="grid grid-cols-1 gap-3 p-6 w-3/4 m-auto">
      {items.map((item) => (
        <div 
          key={item._id} 
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          {/* Food Image */}
          <div className="h-96 overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Food Details */}
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-semibold">
                {item.category}
              </span>
            </div>

            <p className="text-gray-600 mt-2">{item.description}</p>

            <div className="mt-4 flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-900">
                ${item.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500">
                Stock: {item.stock}
              </span>
            </div>

            {/* Quantity Selector
            <div className="mt-4 flex items-center">
              <label htmlFor={`quantity-${item._id}`} className="mr-2 text-gray-700">
                Qty:
              </label>
              <input
                type="number"
                id={`quantity-${item._id}`}
                min="1"
                max={item.stock}
                value={quantities[item._id] || 1}
                onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
              />
            </div> */}

            {/* Action Buttons */}
            <div className="mt-6 flex space-x-2">
                <Link
                    href={`/dashboard/pages/product/${item._id}`}
                    className="flex-1 bg-blue-600 text-center hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-300"
                >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodCard;