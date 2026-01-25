import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCartBar from "@/components/cart/FloatingCartBar";
import { storeApi } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Store {
    _id: string;
    name: string;
    description: string;
    bannerImage: string;
}

const Partners = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const data = await storeApi.getStores();
                setStores(data);
            } catch (error) {
                console.error("Failed to fetch stores", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStores();
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-12 container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Our Partner Stores</h1>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-64 rounded-xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stores.map((store) => (
                            <Link key={store._id} to={`/partners/${store._id}`}>
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-none ring-1 ring-slate-200">
                                    <div className="h-48 w-full overflow-hidden">
                                        <img
                                            src={store.bannerImage}
                                            alt={store.name}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <CardContent className="p-4">
                                        <h2 className="text-xl font-semibold mb-2">{store.name}</h2>
                                        <p className="text-slate-600 text-sm line-clamp-2">{store.description}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
            <FloatingCartBar />
        </div>
    );
};

export default Partners;
