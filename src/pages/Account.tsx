import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Download, LogOut, Package, Ticket } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useMember } from "@/context/MemberContext";
import { api } from "@/lib/api";
import { Order, SupportTicket } from "@/data/types";

type AccountTab = "orders" | "downloads" | "tickets";

const formatPrice = (price?: number, currency = "EGP") =>
  new Intl.NumberFormat("ar-EG", { style: "currency", currency, maximumFractionDigits: 0 }).format(price || 0);

const Account = ({ initialTab = "orders" }: { initialTab?: AccountTab }) => {
  const { member, token, isAuthenticated, logout } = useMember();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AccountTab>(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        const [ordersData, downloadsData, ticketsData] = await Promise.all([
          api.getMyOrders(token),
          api.getMyDownloads(token),
          api.getMyTickets(token),
        ]);
        setOrders(ordersData || []);
        setDownloads(downloadsData || []);
        setTickets(ticketsData || []);
      } catch (error) {
        console.error("Failed to load account data:", error);
      }
    };
    load();
  }, [isAuthenticated, token, navigate]);

  const statusLabel = (status: string) => {
    if (status === "paid") return "مدفوع";
    if (status === "rejected") return "مرفوض";
    if (status === "cancelled") return "ملغي";
    return "قيد المراجعة";
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <main className="pt-24">
        <section className="bg-gradient-hero py-12 text-secondary-foreground">
          <div className="container-custom flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold text-primary">حساب العميل</p>
              <h1 className="heading-lg">{member?.fullName || "حسابي"}</h1>
              <p className="mt-2 text-secondary-foreground/70">{member?.email}</p>
            </div>
            <Button variant="heroOutline" onClick={() => { logout(); navigate("/"); }}>
              <LogOut size={16} />
              خروج
            </Button>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            <div className="mb-6 flex flex-wrap gap-2">
              <Button variant={tab === "orders" ? "default" : "outline"} onClick={() => setTab("orders")}><Package size={16} /> الطلبات</Button>
              <Button variant={tab === "downloads" ? "default" : "outline"} onClick={() => setTab("downloads")}><Download size={16} /> مركز التحميل</Button>
              <Button variant={tab === "tickets" ? "default" : "outline"} onClick={() => setTab("tickets")}><Ticket size={16} /> التذاكر</Button>
            </div>

            {tab === "orders" && (
              <div className="space-y-4">
                {orders.map((order) => (
                  <article key={order.id} className="rounded-lg border border-border bg-card p-5 shadow-card">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-heading text-lg font-bold">طلب #{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString("ar-EG")}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-md px-3 py-1 text-sm font-bold ${order.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {statusLabel(order.status)}
                        </span>
                        <span className="font-heading text-xl font-extrabold text-primary">{formatPrice(order.total, order.currency)}</span>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      {order.items?.map((item) => <p key={item.id || item.productId}>{item.productTitle} x {item.quantity}</p>)}
                    </div>
                  </article>
                ))}
                {orders.length === 0 && <EmptyState text="لم تقم بإنشاء طلبات بعد." link="/store" label="تصفح المنتجات" />}
              </div>
            )}

            {tab === "downloads" && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {downloads.map((item) => (
                  <article key={item.productId} className="rounded-lg border border-border bg-card p-5 shadow-card">
                    <p className="font-heading text-lg font-bold">{item.productTitle}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">متاح لأن طلبك مدفوع ومعتمد.</p>
                    <Button className="mt-5 w-full" asChild>
                      <a href={api.getDownloadUrl(item.productId, token)}>
                        <Download size={16} />
                        تحميل الملف
                      </a>
                    </Button>
                  </article>
                ))}
                {downloads.length === 0 && <EmptyState text="لا توجد ملفات متاحة بعد. ستظهر هنا بعد اعتماد الدفع." link="/store" label="العودة للمتجر" />}
              </div>
            )}

            {tab === "tickets" && (
              <div className="space-y-4">
                <Button asChild><Link to="/support">فتح تذكرة جديدة</Link></Button>
                {tickets.map((ticket) => (
                  <article key={ticket.id} className="rounded-lg border border-border bg-card p-5 shadow-card">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-heading text-lg font-bold">#{ticket.ticketNumber} - {ticket.subject}</p>
                        <p className="text-sm text-muted-foreground">{ticket.department} - {ticket.priority}</p>
                      </div>
                      <span className="rounded-md bg-primary/10 px-3 py-1 text-sm font-bold text-primary">{ticket.status}</span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">{ticket.message}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const EmptyState = ({ text, link, label }: { text: string; link: string; label: string }) => (
  <div className="col-span-full rounded-lg border border-dashed border-border p-10 text-center">
    <p className="text-muted-foreground">{text}</p>
    <Button className="mt-4" asChild><Link to={link}>{label}</Link></Button>
  </div>
);

export default Account;
