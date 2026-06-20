import { useEffect, useState } from "react";
import { CheckCircle2, Plus, Save, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/context/DataContext";
import { api, uploadFile } from "@/lib/api";

const tabs = [
  ["products", "Products"],
  ["orders", "Orders"],
  ["coupons", "Coupons"],
  ["payments", "Payments"],
  ["reviews", "Reviews"],
  ["portfolio", "Portfolio"],
  ["directory", "Directory"],
  ["chatbot", "Chatbot"],
] as const;

const emptyProduct = {
  id: "",
  title: "",
  slug: "",
  categoryId: "",
  shortDescription: "",
  description: "",
  image: "",
  price: "0",
  salePrice: "",
  currency: "EGP",
  type: "digital",
  badge: "",
  features: "",
  demoUrl: "",
  deliveryTime: "",
  downloadFile: "",
  isFeatured: true,
  isActive: true,
};

const AdminStore = () => {
  const { data, refreshData } = useData();
  const { toast } = useToast();
  const [tab, setTab] = useState<typeof tabs[number][0]>("products");
  const [productForm, setProductForm] = useState(emptyProduct);
  const [orders, setOrders] = useState<any[]>([]);
  const [simpleForm, setSimpleForm] = useState<Record<string, string>>({});

  const loadOrders = async () => {
    try {
      const result = await api.getOrders();
      setOrders(result || []);
    } catch (error) {
      console.error("Failed to load orders", error);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const resetProduct = () => setProductForm(emptyProduct);

  const editProduct = (product: any) => {
    setProductForm({
      ...emptyProduct,
      ...product,
      price: String(product.price || 0),
      salePrice: product.salePrice ? String(product.salePrice) : "",
      features: (product.features || []).join("\n"),
    });
    setTab("products");
  };

  const saveProduct = async () => {
    const payload = {
      ...productForm,
      price: Number(productForm.price || 0),
      salePrice: productForm.salePrice ? Number(productForm.salePrice) : undefined,
      features: productForm.features.split("\n").map((item) => item.trim()).filter(Boolean),
      gallery: [],
      rating: 5,
      salesCount: 0,
      sortOrder: 0,
    };

    if (!payload.title.trim()) return;

    try {
      if (productForm.id) {
        await api.updateProduct(productForm.id, payload);
      } else {
        await api.addProduct(payload);
      }
      await refreshData();
      resetProduct();
      toast({ title: "Product saved" });
    } catch {
      toast({ title: "Failed to save product", variant: "destructive" });
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete product?")) return;
    await api.deleteProduct(id);
    await refreshData();
  };

  const handleUpload = async (field: "image" | "downloadFile", file?: File) => {
    if (!file) return;
    const category = field === "downloadFile" ? "product-files" : "products";
    const response = await uploadFile(file, category);
    setProductForm((prev) => ({ ...prev, [field]: response.url }));
  };

  const updateOrder = async (id: string, status: string) => {
    await api.updateOrder(id, { status });
    await loadOrders();
    toast({ title: "Order updated" });
  };

  const saveSimple = async (kind: string) => {
    const form = simpleForm;
    try {
      if (kind === "coupon") {
        await api.addCoupon({
          code: form.code,
          type: form.type || "percent",
          value: Number(form.value || 0),
          minSubtotal: Number(form.minSubtotal || 0),
          maxUses: Number(form.maxUses || 0),
          isActive: true,
        });
      }
      if (kind === "payment") {
        await api.addPaymentMethod({
          key: form.key,
          name: form.name,
          accountLabel: form.accountLabel,
          instructions: form.instructions,
          isActive: true,
          sortOrder: 0,
        });
      }
      if (kind === "review") {
        await api.addReview({
          productId: form.productId,
          customerName: form.customerName,
          customerTitle: form.customerTitle,
          rating: Number(form.rating || 5),
          comment: form.comment,
          isFeatured: true,
          isApproved: true,
        });
      }
      if (kind === "portfolio") {
        await api.addPortfolioProject({
          title: form.title,
          slug: form.slug,
          category: form.category,
          description: form.description,
          image: form.image || "",
          projectUrl: form.projectUrl,
          relatedProductId: form.relatedProductId,
          isFeatured: true,
          sortOrder: 0,
        });
      }
      if (kind === "directory") {
        await api.addDirectorySite({
          title: form.title,
          slug: form.slug,
          category: form.category,
          description: form.description,
          url: form.url,
          image: form.image || "",
          isActive: true,
          sortOrder: 0,
        });
      }
      if (kind === "chatbot") {
        await api.addChatbotAnswer({
          question: form.question,
          keywords: (form.keywords || "").split(",").map((item) => item.trim()).filter(Boolean),
          answers: (form.answers || "").split("\n").map((item) => item.trim()).filter(Boolean),
          isActive: true,
          sortOrder: 0,
        });
      }
      setSimpleForm({});
      await refreshData();
      toast({ title: "Saved" });
    } catch {
      toast({ title: "Save failed", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Telgawy Store</h1>
        <p className="text-muted-foreground">Manage products, secure downloads, payments, coupons, portfolio, directory, reviews, and chatbot answers.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map(([key, label]) => (
          <Button key={key} variant={tab === key ? "default" : "outline"} onClick={() => setTab(key)}>
            {label}
          </Button>
        ))}
      </div>

      {tab === "products" && (
        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <div className="rounded-lg border bg-card p-5 shadow-card">
            <h2 className="mb-4 font-heading text-lg font-bold">{productForm.id ? "Edit Product" : "Add Product"}</h2>
            <div className="space-y-3">
              <Input placeholder="Title" value={productForm.title} onChange={(e) => setProductForm((p) => ({ ...p, title: e.target.value }))} />
              <Input placeholder="Slug" value={productForm.slug} onChange={(e) => setProductForm((p) => ({ ...p, slug: e.target.value }))} />
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={productForm.categoryId} onChange={(e) => setProductForm((p) => ({ ...p, categoryId: e.target.value }))}>
                <option value="">Category</option>
                {(data.productCategories || []).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={productForm.type} onChange={(e) => setProductForm((p) => ({ ...p, type: e.target.value }))}>
                <option value="digital">Digital</option>
                <option value="service">Service</option>
                <option value="hosting">Hosting</option>
                <option value="package">Package</option>
              </select>
              <Textarea placeholder="Short description" value={productForm.shortDescription} onChange={(e) => setProductForm((p) => ({ ...p, shortDescription: e.target.value }))} />
              <Textarea placeholder="Full description" value={productForm.description} onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Price" value={productForm.price} onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))} />
                <Input placeholder="Sale price" value={productForm.salePrice} onChange={(e) => setProductForm((p) => ({ ...p, salePrice: e.target.value }))} />
              </div>
              <Input placeholder="Badge" value={productForm.badge} onChange={(e) => setProductForm((p) => ({ ...p, badge: e.target.value }))} />
              <Textarea placeholder="Features, one per line" value={productForm.features} onChange={(e) => setProductForm((p) => ({ ...p, features: e.target.value }))} />
              <Input placeholder="Demo URL" value={productForm.demoUrl} onChange={(e) => setProductForm((p) => ({ ...p, demoUrl: e.target.value }))} />
              <Input placeholder="Delivery time" value={productForm.deliveryTime} onChange={(e) => setProductForm((p) => ({ ...p, deliveryTime: e.target.value }))} />
              <div className="grid grid-cols-2 gap-2">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border p-2 text-sm">
                  <Upload size={15} /> Image
                  <input className="hidden" type="file" accept="image/*" onChange={(e) => handleUpload("image", e.target.files?.[0])} />
                </label>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border p-2 text-sm">
                  <Upload size={15} /> Download
                  <input className="hidden" type="file" onChange={(e) => handleUpload("downloadFile", e.target.files?.[0])} />
                </label>
              </div>
              {productForm.downloadFile && <p className="text-xs text-primary">Private file attached</p>}
              <div className="flex gap-2">
                <Button className="flex-1" onClick={saveProduct}><Save size={16} /> Save</Button>
                <Button variant="outline" onClick={resetProduct}>Reset</Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {(data.products || []).map((product) => (
              <div key={product.id} className="rounded-lg border bg-card p-4 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{product.title}</h3>
                    <p className="text-sm text-muted-foreground">{product.type} - {product.price} {product.currency}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => editProduct(product)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteProduct(product.id)}><Trash2 size={14} /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border bg-card p-5 shadow-card">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-bold">#{order.orderNumber} - {order.memberName}</h3>
                  <p className="text-sm text-muted-foreground">{order.memberEmail} - {order.paymentMethod} - {order.total} {order.currency}</p>
                  <p className="text-sm text-muted-foreground">Reference: {order.paymentReference || "N/A"}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant={order.status === "paid" ? "default" : "outline"} onClick={() => updateOrder(order.id, "paid")}><CheckCircle2 size={15} /> Paid</Button>
                  <Button variant="outline" onClick={() => updateOrder(order.id, "pending")}>Pending</Button>
                  <Button variant="destructive" onClick={() => updateOrder(order.id, "rejected")}>Reject</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "coupons" && <SimplePanel title="Add Coupon" onSave={() => saveSimple("coupon")} simpleForm={simpleForm} setSimpleForm={setSimpleForm} fields={["code", "type", "value", "minSubtotal", "maxUses"]} items={data.coupons || []} />}
      {tab === "payments" && <SimplePanel title="Add Payment Method" onSave={() => saveSimple("payment")} simpleForm={simpleForm} setSimpleForm={setSimpleForm} fields={["key", "name", "accountLabel", "instructions"]} items={data.paymentMethods || []} />}
      {tab === "reviews" && <SimplePanel title="Add Review" onSave={() => saveSimple("review")} simpleForm={simpleForm} setSimpleForm={setSimpleForm} fields={["productId", "customerName", "customerTitle", "rating", "comment"]} items={data.reviews || []} />}
      {tab === "portfolio" && <SimplePanel title="Add Portfolio Project" onSave={() => saveSimple("portfolio")} simpleForm={simpleForm} setSimpleForm={setSimpleForm} fields={["title", "slug", "category", "description", "image", "projectUrl", "relatedProductId"]} items={data.portfolioProjects || []} />}
      {tab === "directory" && <SimplePanel title="Add Directory Site" onSave={() => saveSimple("directory")} simpleForm={simpleForm} setSimpleForm={setSimpleForm} fields={["title", "slug", "category", "description", "url", "image"]} items={data.directorySites || []} />}
      {tab === "chatbot" && <SimplePanel title="Add Chatbot Answer" onSave={() => saveSimple("chatbot")} simpleForm={simpleForm} setSimpleForm={setSimpleForm} fields={["question", "keywords", "answers"]} items={data.chatbotAnswers || []} textareaFields={["answers"]} />}
    </div>
  );
};

const SimplePanel = ({
  title,
  fields,
  textareaFields = [],
  simpleForm,
  setSimpleForm,
  onSave,
  items,
}: {
  title: string;
  fields: string[];
  textareaFields?: string[];
  simpleForm: Record<string, string>;
  setSimpleForm: (value: Record<string, string>) => void;
  onSave: () => void;
  items: any[];
}) => {
  const update = (field: string, value: string) => setSimpleForm({ ...simpleForm, [field]: value });
  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <div className="rounded-lg border bg-card p-5 shadow-card">
        <h2 className="mb-4 font-heading text-lg font-bold">{title}</h2>
        <div className="space-y-3">
          {fields.map((field) => textareaFields.includes(field) ? (
            <Textarea key={field} placeholder={field} value={simpleForm[field] || ""} onChange={(e) => update(field, e.target.value)} />
          ) : (
            <Input key={field} placeholder={field} value={simpleForm[field] || ""} onChange={(e) => update(field, e.target.value)} />
          ))}
          <Button className="w-full" onClick={onSave}><Plus size={16} /> Save</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border bg-card p-4 shadow-card">
            <h3 className="font-bold">{item.title || item.name || item.code || item.question || item.customerName}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{item.description || item.comment || item.instructions || item.url || item.answers?.join(" / ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStore;
