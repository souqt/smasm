import { useEffect, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { SupportTicket } from "@/data/types";

const AdminSupportDesk = () => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [reply, setReply] = useState("");

  const loadTickets = async () => {
    const result = await api.getTickets();
    setTickets(result || []);
    if (!selected && result?.length) setSelected(result[0]);
  };

  const loadReplies = async (ticketId: string) => {
    const result = await api.getTicketReplies(ticketId);
    setReplies(result || []);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (selected?.id) loadReplies(selected.id);
  }, [selected?.id]);

  const updateStatus = async (status: string) => {
    if (!selected) return;
    await api.updateTicket(selected.id, { status });
    await loadTickets();
    setSelected((prev) => prev ? { ...prev, status: status as any } : prev);
    toast({ title: "Ticket updated" });
  };

  const sendReply = async () => {
    if (!selected || !reply.trim()) return;
    await api.addTicketReply(selected.id, { message: reply, senderType: "admin", senderName: "Support" });
    setReply("");
    await loadReplies(selected.id);
    await updateStatus("answered");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Support Tickets</h1>
        <p className="text-muted-foreground">Manage customer support instead of the old jobs workflow.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => setSelected(ticket)}
              className={`w-full rounded-lg border p-4 text-left shadow-card transition-colors ${selected?.id === ticket.id ? "border-primary bg-primary/10" : "bg-card hover:bg-muted"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">#{ticket.ticketNumber}</p>
                  <p className="text-sm text-muted-foreground">{ticket.subject}</p>
                </div>
                <span className="rounded-md bg-muted px-2 py-1 text-xs font-bold">{ticket.status}</span>
              </div>
            </button>
          ))}
        </div>

        {selected ? (
          <div className="rounded-lg border bg-card p-6 shadow-card">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold">{selected.subject}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{selected.fullName} - {selected.email} - {selected.department}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["open", "answered", "pending", "closed"].map((status) => (
                  <Button key={status} size="sm" variant={selected.status === status ? "default" : "outline"} onClick={() => updateStatus(status)}>
                    {status}
                  </Button>
                ))}
              </div>
            </div>
            <div className="mt-5 rounded-lg bg-muted p-4 text-sm leading-7">{selected.message}</div>

            <div className="mt-6 space-y-3">
              <h3 className="flex items-center gap-2 font-bold"><MessageSquare size={18} /> Replies</h3>
              {replies.map((item) => (
                <div key={item.id} className={`rounded-lg border p-4 ${item.senderType === "admin" ? "bg-primary/10" : "bg-muted"}`}>
                  <p className="text-sm font-bold">{item.senderName}</p>
                  <p className="mt-2 text-sm leading-7">{item.message}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Textarea value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a reply..." className="min-h-28" />
              <Button className="mt-3" onClick={sendReply}><Send size={16} /> Send Reply</Button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">No tickets yet.</div>
        )}
      </div>
    </div>
  );
};

export default AdminSupportDesk;
