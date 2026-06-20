import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, MailOpen, Star, StarOff, Trash2, Search, 
  RefreshCw, Filter, Clock, User, Building2, Phone,
  ChevronDown, Reply, Archive, Eye, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface Message {
  id: string;
  fullName: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  isStarred: boolean;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

const AdminMessages = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await api.getMessages();
      setMessages(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (message: Message) => {
    try {
      await api.updateMessage(message.id, {
        ...message,
        isRead: !message.isRead,
        status: !message.isRead ? 'read' : 'new'
      });
      setMessages(messages.map(m => 
        m.id === message.id 
          ? { ...m, isRead: !m.isRead, status: !m.isRead ? 'read' as const : 'new' as const } 
          : m
      ));
    } catch (error) {
      toast({ title: "Error", description: "Failed to update message", variant: "destructive" });
    }
  };

  const handleToggleStar = async (message: Message) => {
    try {
      await api.updateMessage(message.id, {
        ...message,
        isStarred: !message.isStarred
      });
      setMessages(messages.map(m => 
        m.id === message.id ? { ...m, isStarred: !m.isStarred } : m
      ));
    } catch (error) {
      toast({ title: "Error", description: "Failed to update message", variant: "destructive" });
    }
  };

  const handleArchive = async (message: Message) => {
    try {
      await api.updateMessage(message.id, {
        ...message,
        status: 'archived',
        isRead: true
      });
      setMessages(messages.map(m => 
        m.id === message.id ? { ...m, status: 'archived' as const, isRead: true } : m
      ));
      setSelectedMessage(null);
      toast({ title: "Success", description: "Message archived" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to archive message", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteMessage(id);
      setMessages(messages.filter(m => m.id !== id));
      setDeleteMessageId(null);
      setSelectedMessage(null);
      toast({ title: "Success", description: "Message deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete message", variant: "destructive" });
    }
  };

  const openMessage = async (message: Message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      await handleToggleRead(message);
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = 
      msg.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterStatus === "all" ||
      (filterStatus === "unread" && !msg.isRead) ||
      (filterStatus === "starred" && msg.isStarred) ||
      (filterStatus === "archived" && msg.status === "archived") ||
      msg.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter(m => !m.isRead).length;
  const starredCount = messages.filter(m => m.isStarred).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">New</Badge>;
      case 'read':
        return <Badge variant="secondary">Read</Badge>;
      case 'replied':
        return <Badge className="bg-green-500">Replied</Badge>;
      case 'archived':
        return <Badge variant="outline">Archived</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} unread messages` : 'All messages read'}
          </p>
        </div>
        <Button onClick={fetchMessages} variant="outline" className="gap-2">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-card border border-border/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-card border border-border/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MailOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{unreadCount}</p>
              <p className="text-xs text-muted-foreground">Unread</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-card border border-border/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{starredCount}</p>
              <p className="text-xs text-muted-foreground">Starred</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-card border border-border/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
              <Archive className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.filter(m => m.status === 'archived').length}</p>
              <p className="text-xs text-muted-foreground">Archived</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search messages..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter size={16} />
              {filterStatus === 'all' ? 'All Messages' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
              <ChevronDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilterStatus('all')}>All Messages</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('unread')}>Unread</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('starred')}>Starred</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('new')}>New</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('read')}>Read</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('replied')}>Replied</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('archived')}>Archived</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages List */}
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No messages found</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            <AnimatePresence>
              {filteredMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => openMessage(message)}
                  className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                    !message.isRead ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Star Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleToggleStar(message); }}
                      className="mt-1 text-muted-foreground hover:text-amber-500 transition-colors"
                    >
                      {message.isStarred ? (
                        <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                      ) : (
                        <StarOff className="w-5 h-5" />
                      )}
                    </button>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-medium ${!message.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {message.fullName}
                            </span>
                            {!message.isRead && (
                              <span className="w-2 h-2 rounded-full bg-primary" />
                            )}
                            {getStatusBadge(message.status)}
                          </div>
                          <p className={`text-sm truncate ${!message.isRead ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                            {message.subject}
                          </p>
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {message.message}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDate(message.createdAt)}
                          </span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setDeleteMessageId(message.id); }}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Message Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-start justify-between gap-4">
              <span className="text-xl">{selectedMessage?.subject}</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => selectedMessage && handleToggleStar(selectedMessage)}
                  className="text-muted-foreground hover:text-amber-500 transition-colors"
                >
                  {selectedMessage?.isStarred ? (
                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  ) : (
                    <StarOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-6">
              {/* Sender Info */}
              <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{selectedMessage.fullName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.company && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedMessage.company}</span>
                  </div>
                )}
                {selectedMessage.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${selectedMessage.phone}`} className="text-primary hover:underline">
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(selectedMessage.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              
              {/* Message Body */}
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                <Button variant="default" asChild>
                  <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}>
                    <Reply className="w-4 h-4 mr-2" />
                    Reply
                  </a>
                </Button>
                <Button variant="outline" onClick={() => handleArchive(selectedMessage)}>
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => setDeleteMessageId(selectedMessage.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteMessageId} onOpenChange={() => setDeleteMessageId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteMessageId && handleDelete(deleteMessageId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminMessages;
