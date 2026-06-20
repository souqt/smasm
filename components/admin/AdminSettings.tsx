import React, { useState } from "react";
import { Save, Download, Upload, RotateCcw, Image, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useData } from "@/context/DataContext";
import { useToast } from "@/hooks/use-toast";
import ImageUploader from "./ImageUploader";

const AdminSettings = () => {
  const { data, updateSettings, updateContact, exportData, importData, resetData } = useData();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState(data.settings);
  const [contact, setContact] = useState(data.contact);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when data changes
  React.useEffect(() => {
    setSettings(data.settings);
    setContact(data.contact);
  }, [data.settings, data.contact]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await updateSettings(settings);
      await updateContact(contact);
      toast({ title: "Settings saved successfully" });
    } catch (error) {
      toast({ title: "Failed to save settings", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const jsonData = exportData();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-data.json';
    a.click();
    toast({ title: "Data exported successfully" });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (importData(result)) {
          toast({ title: "Data imported successfully" });
          window.location.reload();
        } else {
          toast({ title: "Failed to import data", variant: "destructive" });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      resetData();
      toast({ title: "Data reset to defaults" });
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage site settings and data</p>
      </div>

      {/* Logo Settings */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Image size={20} className="text-primary" />
          <h2 className="font-heading text-xl font-semibold text-foreground">Logo Settings</h2>
        </div>
        <p className="text-muted-foreground text-sm">Upload different logos for different parts of the site.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Loading Logo */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Loading Screen Logo</Label>
            <p className="text-xs text-muted-foreground">Displayed during page load</p>
            <ImageUploader
              value={settings.loadingLogo || settings.logo}
              onChange={(url) => setSettings({...settings, loadingLogo: url})}
              category="logos"
              placeholder="Upload loading logo"
            />
          </div>
          
          {/* Header Logo */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Header Logo</Label>
            <p className="text-xs text-muted-foreground">Displayed in navigation bar</p>
            <ImageUploader
              value={settings.headerLogo || settings.logo}
              onChange={(url) => setSettings({...settings, headerLogo: url})}
              category="logos"
              placeholder="Upload header logo"
            />
          </div>
          
          {/* Footer Logo */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Footer Logo</Label>
            <p className="text-xs text-muted-foreground">Displayed in footer section</p>
            <ImageUploader
              value={settings.footerLogo || settings.logo}
              onChange={(url) => setSettings({...settings, footerLogo: url})}
              category="logos"
              placeholder="Upload footer logo"
            />
          </div>
        </div>

        {/* Logo Display Settings */}
        <div className="border-t border-border pt-6 space-y-4">
          <h3 className="font-heading text-lg font-semibold text-foreground">Header Logo Display</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Logo Height: {settings.headerLogoSize || 80}px</Label>
            </div>
            <Slider
              value={[settings.headerLogoSize || 80]}
              onValueChange={(val) => setSettings({...settings, headerLogoSize: val[0]})}
              min={30}
              max={150}
              step={5}
              className="w-full max-w-sm"
            />
            <p className="text-xs text-muted-foreground">Adjust the header logo height (30px - 150px)</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Horizontal Position: {settings.headerLogoOffsetX || 0}px</Label>
            </div>
            <Slider
              value={[settings.headerLogoOffsetX || 0]}
              onValueChange={(val) => setSettings({...settings, headerLogoOffsetX: val[0]})}
              min={-100}
              max={100}
              step={5}
              className="w-full max-w-sm"
            />
            <p className="text-xs text-muted-foreground">Move logo left (-100) or right (+100) from default position</p>
          </div>
          <div className="flex items-center justify-between max-w-sm">
            <div>
              <Label>Hover Effect</Label>
              <p className="text-xs text-muted-foreground">Scale animation & glow on mouse hover</p>
            </div>
            <Switch
              checked={settings.headerLogoHoverEffect !== false}
              onCheckedChange={(checked) => setSettings({...settings, headerLogoHoverEffect: checked})}
            />
          </div>
        </div>
      </div>

      {/* Site Settings */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-6">
        <h2 className="font-heading text-xl font-semibold text-foreground">Site Information</h2>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input value={settings.siteName} onChange={(e) => setSettings({...settings, siteName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input value={settings.tagline} onChange={(e) => setSettings({...settings, tagline: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={settings.description} onChange={(e) => setSettings({...settings, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>WhatsApp Number</Label>
              <Input value={settings.whatsappNumber || ''} onChange={(e) => setSettings({...settings, whatsappNumber: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>InstaPay Handle</Label>
              <Input value={settings.instapayHandle || ''} onChange={(e) => setSettings({...settings, instapayHandle: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Vodafone Cash Number</Label>
              <Input value={settings.vodafoneCashNumber || ''} onChange={(e) => setSettings({...settings, vodafoneCashNumber: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>PayPal Email</Label>
              <Input value={settings.paypalEmail || ''} onChange={(e) => setSettings({...settings, paypalEmail: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Bank Account Details</Label>
            <Textarea value={settings.bankAccountDetails || ''} onChange={(e) => setSettings({...settings, bankAccountDetails: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>AI Chat Webhook URL</Label>
            <Input value={settings.aiChatWebhookUrl || ''} onChange={(e) => setSettings({...settings, aiChatWebhookUrl: e.target.value})} />
          </div>
        </div>
      </div>

      {/* Notification Email */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-6">
        <h2 className="font-heading text-xl font-semibold text-foreground">Email Notifications</h2>
        <p className="text-muted-foreground text-sm">
          Enter the email address where you want to receive notifications when someone submits a job application (CV) or sends a contact message.
        </p>
        <div className="space-y-2">
          <Label>Notification Email</Label>
          <Input 
            value={contact.notificationEmail || ''} 
            onChange={(e) => setContact({...contact, notificationEmail: e.target.value})} 
            placeholder="e.g. hr@company.com"
            type="email"
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-6">
        <h2 className="font-heading text-xl font-semibold text-foreground">Contact Information</h2>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={contact.email} onChange={(e) => setContact({...contact, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Secondary Email</Label>
              <Input value={contact.secondaryEmail || ''} onChange={(e) => setContact({...contact, secondaryEmail: e.target.value})} placeholder="e.g. support@company.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={contact.phone} onChange={(e) => setContact({...contact, phone: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Secondary Phone</Label>
              <Input value={contact.secondaryPhone || ''} onChange={(e) => setContact({...contact, secondaryPhone: e.target.value})} placeholder="e.g. +1 234 567 891" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input value={contact.address} onChange={(e) => setContact({...contact, address: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Working Hours</Label>
              <Input value={contact.workingHours || ''} onChange={(e) => setContact({...contact, workingHours: e.target.value})} placeholder="e.g. Mon - Fri: 9AM - 6PM EST" />
            </div>
            <div className="space-y-2">
              <Label>Working Hours (Weekend)</Label>
              <Input value={contact.workingHoursWeekend || ''} onChange={(e) => setContact({...contact, workingHoursWeekend: e.target.value})} placeholder="e.g. Weekend: By appointment" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>LinkedIn</Label>
              <Input value={contact.socialLinks?.linkedin || ''} onChange={(e) => setContact({...contact, socialLinks: {...contact.socialLinks, linkedin: e.target.value}})} />
            </div>
            <div className="space-y-2">
              <Label>Twitter</Label>
              <Input value={contact.socialLinks?.twitter || ''} onChange={(e) => setContact({...contact, socialLinks: {...contact.socialLinks, twitter: e.target.value}})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>GitHub</Label>
              <Input value={contact.socialLinks?.github || ''} onChange={(e) => setContact({...contact, socialLinks: {...contact.socialLinks, github: e.target.value}})} />
            </div>
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input value={contact.socialLinks?.instagram || ''} onChange={(e) => setContact({...contact, socialLinks: {...contact.socialLinks, instagram: e.target.value}})} />
            </div>
          </div>
        </div>
        <Button onClick={handleSaveSettings} disabled={isSaving} className="gap-2">
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

    </div>
  );
};

export default AdminSettings;
