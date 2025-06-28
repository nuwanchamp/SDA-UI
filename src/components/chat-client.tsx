"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  FileText,
  History,
  Loader2,
  LogOut,
  LogIn,
  Plus,
  Send,
  Trash2,
  Upload,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  askQuestion,
  logout,
  uploadDocument,
  getHistory,
} from "@/app/chat/actions";
import type { HistoryItem, Document, ChatMessage } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

type CompositeDocument = Document & { isFromHistory?: boolean };

export function ChatClient({
  initialHistory,
  isGuest,
}: {
  initialHistory: HistoryItem[];
  isGuest: boolean;
}) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [history, setHistory] = useState<HistoryItem[]>(initialHistory);
  const [documents, setDocuments] = useState<CompositeDocument[]>([]);
  const [selectedDocument, setSelectedDocument] =
    useState<CompositeDocument | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);

  useEffect(() => {
    const docsFromHistory = new Map<number, CompositeDocument>();
    initialHistory.forEach((item) => {
      if (!docsFromHistory.has(item.document_id)) {
        docsFromHistory.set(item.document_id, {
          id: item.document_id,
          filename: `Document #${item.document_id}`,
          isFromHistory: true,
          mime_type: "",
          file_size: 0,
          uploaded_at: item.created_at,
        });
      }
    });
    setDocuments(Array.from(docsFromHistory.values()));
  }, [initialHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadDocument(formData);
    setIsUploading(false);

    if (result.success && result.document) {
      toast({ title: "Upload successful", description: result.document.filename });
      setDocuments((prev) => [result.document!, ...prev]);
      setSelectedDocument(result.document);
      setMessages([]);
    } else {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: result.error,
      });
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedDocument || isAsking) return;

    const question = input;
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: question },
      {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: <Loader2 className="h-5 w-5 animate-spin" />,
        isLoading: true,
      },
    ]);
    setIsAsking(true);

    const result = await askQuestion(selectedDocument.id, question);
    setIsAsking(false);

    setMessages((prev) =>
      prev.map((msg) =>
        msg.isLoading
          ? {
              ...msg,
              isLoading: false,
              content: result.success
                ? result.answer ?? "Sorry, I couldn't find an answer."
                : `Error: ${result.error}`,
            }
          : msg
      )
    );

    if (result.success) {
      const newHistory = await getHistory();
      setHistory(newHistory);
    }
  };

  const handleNewChat = () => {
    setSelectedDocument(null);
    setMessages([]);
    setInput("");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-secondary/50 w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-headline font-semibold">DocuChat</h2>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-0">
             <div className="p-2">
               <Button className="w-full" onClick={handleNewChat}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Chat
               </Button>
             </div>
             <SidebarSeparator />
            <SidebarGroupLabel className="font-headline">Documents</SidebarGroupLabel>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.txt"
            />
            <Button
              variant="outline"
              className="mx-4 my-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload Document
            </Button>
            <SidebarMenu>
              {documents.map((doc) => (
                <SidebarMenuItem key={doc.id}>
                  <SidebarMenuButton
                    onClick={() => {
                      setSelectedDocument(doc);
                      setMessages([]);
                    }}
                    isActive={selectedDocument?.id === doc.id}
                  >
                    <FileText />
                    <span>{doc.filename}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
             <SidebarSeparator />
            <SidebarGroupLabel className="font-headline">History</SidebarGroupLabel>
            <ScrollArea className="h-64 px-2">
              <SidebarMenu>
                {history.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => {
                         toast({
                          title: "History",
                          description: (
                            <div>
                              <p className="font-bold">Q: {item.question}</p>
                              <p>A: {item.answer}</p>
                            </div>
                          )
                        })
                      }}
                      className="truncate"
                    >
                      <History />
                      <span>{item.question}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </ScrollArea>
          </SidebarContent>
          <SidebarFooter>
            {isGuest ? (
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login / Sign Up
                </Link>
              </Button>
            ) : (
              <form action={logout}>
                <Button variant="ghost" className="w-full justify-start" type="submit">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </form>
            )}
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col">
          <header className="p-4 border-b flex items-center justify-between bg-background rounded-t-xl">
             <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h3 className="text-lg font-semibold font-headline">
                {selectedDocument ? selectedDocument.filename : "Welcome"}
              </h3>
             </div>
             {selectedDocument && (
               <Badge variant="outline">{selectedDocument.isFromHistory ? 'From History' : 'Uploaded'}</Badge>
             )}
          </header>

          <main className="flex-1 flex flex-col p-4 overflow-y-auto">
            <ScrollArea className="flex-1 -mx-4">
              <div className="px-4">
                {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-center">
                    <div>
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100 font-headline">
                        {selectedDocument ? `Ask a question about ${selectedDocument.filename}` : "Select or upload a document"}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by selecting a document from the sidebar or uploading a new one.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-end gap-2 ${
                          message.role === "user" ? "justify-end" : ""
                        }`}
                      >
                        {message.role === "assistant" && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              AI
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <Card
                          className={`max-w-xl ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-card"
                          }`}
                        >
                          <CardContent className="p-3 text-sm">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              {message.content}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </ScrollArea>
          </main>

          <footer className="p-4 border-t bg-background rounded-b-xl">
            <form onSubmit={handleAskQuestion} className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  selectedDocument
                    ? "Ask a question..."
                    : "Please select a document first"
                }
                disabled={!selectedDocument || isAsking}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || !selectedDocument || isAsking}>
                {isAsking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
