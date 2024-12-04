import React, { useState } from "react";
import { PlusCircle, Trash2, Download, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { LogoUploader } from "./LogoUploader";
import { TaxDiscountSection } from "./TaxDiscountSection";
import jsPDF from "jspdf";

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export const InvoiceMaker: React.FC = () => {
  const [clientName, setClientName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, price: 0 },
  ]);
  const [logo, setLogo] = useState<string | null>(null);
  const [taxRate, setTaxRate] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);

  const generateInvoice = () => {
    const doc = new jsPDF();
  
    // Add background template image
    const templateImage = 'path/to/your/template-image.jpg'; // Update with your image path
    doc.addImage(templateImage, 'JPEG', 0, 0, 210, 297); // A4 size
  
    // Add logo if available
    if (logo) {
      const img = new Image();
      img.src = logo;
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const width = 50;
        const height = width / aspectRatio;
        doc.addImage(img, 'JPEG', 20, 20, width, height);
  
        // Continue with PDF generation after logo is loaded
        finalizePDF(doc);
      };
    } else {
      // If no logo, finalize PDF immediately
      finalizePDF(doc);
    }
  };
  
  const finalizePDF = (doc: jsPDF) => {
    // Title
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 34, 34);
    doc.text("INVOICE", 105, 50, { align: "center" });
  
    // Company Name
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 204);
    doc.text(companyName || "Company Name", 105, 70, { align: "center" });
  
    // Invoice details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`Invoice Date: ${invoiceDate}`, 20, 90);
    doc.text(`Due Date: ${dueDate}`, 150, 90);
    doc.text(`Client Name: ${clientName}`, 20, 100);
    doc.text(`Invoice Number: ${invoiceNumber}`, 150, 100);
  
    // Decorative line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 110, 190, 110);
  
    // Table headers
    doc.setFillColor(240, 248, 255);
    doc.rect(20, 120, 170, 10, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text("Item", 25, 127);
    doc.text("Quantity", 95, 127);
    doc.text("Price", 125, 127);
    doc.text("Amount", 165, 127);
  
    // Table content
    let yOffset = 140;
    items.forEach((item) => {
      const amount = item.quantity * item.price;
      doc.setTextColor(60, 60, 60);
      doc.text(item.description, 25, yOffset);
      doc.text(item.quantity.toString(), 95, yOffset);
      doc.text(`$${item.price.toFixed(2)}`, 125, yOffset);
      doc.text(`$${amount.toFixed(2)}`, 165, yOffset);
      yOffset += 10;
    });
  
    // Total section
    yOffset += 10;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 204);
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 150, yOffset);
    doc.text(`Discount: $${discountAmount.toFixed(2)}`, 150, yOffset + 10);
    doc.text(`Tax: $${taxAmount.toFixed(2)}`, 150, yOffset + 20);
    doc.text(`Total: $${total.toFixed(2)}`, 150, yOffset + 30);
  
    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for your business!", 105, 290, { align: "center" });
  
    doc.save(`invoice_${invoiceNumber || "001"}.pdf`);
  };
  
  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const saveInvoice = () => {
    const invoice = {
      clientName,
      companyName,
      invoiceNumber,
      invoiceDate,
      dueDate,
      items,
      logo,
      taxRate,
      discountRate,
    };
    localStorage.setItem("savedInvoice", JSON.stringify(invoice));
    alert("Invoice saved successfully!");
  };

  const loadInvoice = () => {
    const savedInvoice = localStorage.getItem("savedInvoice");
    if (savedInvoice) {
      const invoice = JSON.parse(savedInvoice);
      setClientName(invoice.clientName);
      setCompanyName(invoice.companyName);
      setInvoiceNumber(invoice.invoiceNumber);
      setInvoiceDate(invoice.invoiceDate);
      setDueDate(invoice.dueDate);
      setItems(invoice.items);
      setLogo(invoice.logo);
      setTaxRate(invoice.taxRate);
      setDiscountRate(invoice.discountRate);
      alert("Invoice loaded successfully!");
    } else {
      alert("No saved invoice found.");
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const discountAmount = subtotal * (discountRate / 100);
  const taxAmount = (subtotal - discountAmount) * (taxRate / 100);
  const total = subtotal - discountAmount + taxAmount;

  return (
    <Card className="w-full h-full bg-white shadow-2xl flex flex-col max-w-7xl mx-auto">
      <div className="flex-grow overflow-y-auto">
        <CardContent className="p-6 space-y-6 md:p-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-full md:w-1/3 max-w-xs mx-auto md:mx-0">
              <LogoUploader logo={logo} setLogo={setLogo} />
            </div>
            <div className="w-full md:w-2/3 text-center md:text-right">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                {companyName || "Company Name"}
              </h2>
              <p className="text-xl text-gray-600 mt-2">
                Invoice #{invoiceNumber || "INV-001"}
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Label
                htmlFor="companyName"
                className="text-sm font-medium text-gray-700"
              >
                Company Name
              </Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-1"
                placeholder="Enter company name"
              />
            </div>
            <div>
              <Label
                htmlFor="invoiceNumber"
                className="text-sm font-medium text-gray-700"
              >
                Invoice Number
              </Label>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="mt-1"
                placeholder="e.g., INV-001"
              />
            </div>
          </div>
          <div>
            <Label
              htmlFor="clientName"
              className="text-sm font-medium text-gray-700"
            >
              Client Name
            </Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="mt-1"
              placeholder="Enter client name"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="invoiceDate"
                className="text-sm font-medium text-gray-700"
              >
                Invoice Date
              </Label>
              <Input
                id="invoiceDate"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label
                htmlFor="dueDate"
                className="text-sm font-medium text-gray-700"
              >
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <Separator className="my-6" />
          <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 font-medium text-gray-700 bg-gray-50 p-4 rounded-lg">
    {/* Description */}
    <div className="col-span-6 md:col-span-6 flex items-center">Description</div>
    
    {/* Quantity */}
    <div className="col-span-3 md:col-span-2 flex items-center justify-start">Quantity</div>
    
    {/* Price */}
    <div className="col-span-3 md:col-span-3 flex items-center justify-start">Price</div>
    
    {/* Empty space */}
    <div className="col-span-1 md:col-span-1"></div>
  </div>
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-center">
                <Input
                  type="text"
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) =>
                    updateItem(index, "description", e.target.value)
                  }
                  className="col-span-6 md:col-span-6"
                />
                <Input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, "quantity", parseInt(e.target.value, 10))
                  }
                  className="col-span-2 md:col-span-2"
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) =>
                    updateItem(index, "price", parseFloat(e.target.value))
                  }
                  className="col-span-3 md:col-span-3"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeItem(index)}
                  className="col-span-1 md:col-span-1"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            onClick={addItem}
            variant="outline"
            className="w-full bg-black text-white hover:bg-gray-800"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add Item
          </Button>
          <TaxDiscountSection
            taxRate={taxRate}
            setTaxRate={setTaxRate}
            discountRate={discountRate}
            setDiscountRate={setDiscountRate}
          />
        </CardContent>
      </div>
      <CardFooter className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-6 border-t">
        <div className="space-y-1 mb-4 md:mb-0">
          <div className="text-sm text-gray-600">
            Subtotal: ${subtotal.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">
            Discount: ${discountAmount.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">
            Tax: ${taxAmount.toFixed(2)}
          </div>
          <div className="text-2xl font-bold text-purple-600">
            Total: ${total.toFixed(2)}
          </div>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end items-center gap-2">
          <Button
            onClick={saveInvoice}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" /> Save
          </Button>
          <Button
            onClick={loadInvoice}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="h-4 w-4 mr-2" /> Load
          </Button>
          <Button
            onClick={generateInvoice}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Generate Invoice
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
