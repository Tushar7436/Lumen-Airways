export default function HelpPage(){
    return(
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-4">Help & Support</h1>
            <p className="text-gray-700 mb-6">Find answers to common questions and ways to contact us.</p>
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold">Booking & Payments</h2>
                    <p className="text-gray-600">Check your email for booking confirmations. For payment issues, try again or contact support.</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Price Alerts</h2>
                    <p className="text-gray-600">Enable alerts to get notified when prices drop for your saved routes.</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Contact</h2>
                    <p className="text-gray-600">Email: support@example.com</p>
                </div>
            </div>
        </div>
    )
}


