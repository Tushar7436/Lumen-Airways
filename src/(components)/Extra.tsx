export default function Extra(){
  return(
      <div className="py-16 flex justify-center">
      <div className="max-w-6xl bg-[rgba(239,243,248,1)] font-extralight tracking-normal text-black justify-center mx-1.5 my-1.5 rounded-lg">
        <div className="text-center mb-12">
          <h2 className="font-bold text-gray-900 mb-6 text-3xl pt-2.5 mt-2">
            Looking for the best flight deals to anywhere in the world?
          </h2>
          <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto text-base">
            It's easy around here. 100 million travellers use us as their go-to tool, comparing flight deals and
            offers from more than 1,200 airlines and travel providers. With so many options to choose from in one
            place, you can say hello to savings, and goodbye to stress – here's how.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Search Everywhere Feature */}
          <div className="text-center">
            <div className="mb-6 flex justify-center items-end">
              <div className="w-36 h-24 flex items-center justify-center">
                <svg className=" text-white">
                  <image href="/image1.svg" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Search 'Everywhere', explore anywhere</h3>
            <p className="text-gray-600 leading-relaxed">
              Enter your departure airport and travel dates, then hit 'Everywhere'. You'll see flights to every
              destination in the world, cheapest first.
            </p>
          </div>

          {/* Transparent Pricing Feature */}
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-36 h-24 flex items-center justify-center">
                <svg className=" text-white">
                  <image href="/image2.svg" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Pay less, go further with transparent pricing
            </h3>
            <p className="text-gray-600 leading-relaxed">
              The cheapest flight deals. No hidden fees. No funny business. With us, the price you see when you search
              is what you'll pay.
            </p>
          </div>

          {/* Price Alerts Feature */}
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-36 h-24 flex items-center justify-center">
                <svg className=" text-white">
                  <image href="/image3.svg" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Book when it's best with Price Alerts</h3>
            <p className="text-gray-600 leading-relaxed">
              Found your flight, but not quite ready to book? Set up Price Alerts and we'll let you know when your
              flight price goes up or down.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}