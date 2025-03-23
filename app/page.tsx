"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  GitHubLogoIcon,
  DownloadIcon,
  ReloadIcon,
  PlusIcon,
  Cross1Icon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { CodeIcon } from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    title: "ParsonLabs Music",
    description:
      "ParsonLabs Music is the Self Hosted Audio streaming alternative to YouTube Music, Spotify & Apple Music, providing Unrestricted Access to your library in Uncompressed, Lossless Quality",
    githubUsername: "parsonlabs",
    logoUrl: "https://avatars.githubusercontent.com/u/138057124?s=200&v=4",
    badges: ["PWA"],
    customLinks: [
      { label: "Get Started", url: "#" },
      { label: "Documentation", url: "https://docs.parsonlabs.com" },
      {
        label: "Releases",
        url: "https://github.com/WillKirkmanM/music/releases",
      },
    ],
    screenshots: ["/music.png"] as string[],
    isLoading: false,
  });
  const [previewMode, setPreviewMode] = useState<"preview" | "code">("preview");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (e.target.name === "logo") {
          setFormData((prev) => ({
            ...prev,
            logoUrl: event.target?.result as string,
          }));
        } else if (e.target.name === "screenshot") {
          setFormData((prev) => ({
            ...prev,
            screenshots: [...prev.screenshots, event.target?.result as string],
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchGithubProfile = async () => {
    if (!formData.githubUsername) return;

    setFormData((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch(
        `https://api.github.com/users/${formData.githubUsername}`
      );
      const data = await response.json();
      if (data.avatar_url) {
        setFormData((prev) => ({
          ...prev,
          logoUrl: data.avatar_url,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Error fetching GitHub profile:", error);
      setFormData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleCustomLinkChange = (
    index: number,
    field: "label" | "url",
    value: string
  ) => {
    setFormData((prev) => {
      const newLinks = [...prev.customLinks];
      newLinks[index] = { ...newLinks[index], [field]: value };
      return { ...prev, customLinks: newLinks };
    });
  };

  const addCustomLink = () => {
    setFormData((prev) => ({
      ...prev,
      customLinks: [...prev.customLinks, { label: "Custom Link", url: "#" }],
    }));
  };

  const removeCustomLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customLinks: prev.customLinks.filter((_, i) => i !== index),
    }));
  };

  const generateReadmeCode = () => {
    return `
<p align="center">
  <img src="${
    formData.logoUrl || "https://via.placeholder.com/200"
  }" width="150" />
</p>
<h1 align="center">${formData.title}</h1>

<p align="center">
  ${
    formData.badges.includes("PWA")
      ? '<img src="https://www.pwa-shields.com/1.0.0/series/certified/purple.svg" alt="PWA Shields" height="20">'
      : ""
  }
</p>

<h4 align="center">
  ${formData.customLinks
    .map((link) => `<a href="${link.url}">${link.label}</a>`)
    .join("\n  ·\n  ")}
</h4>

<p align="center">${formData.description}</p>

${formData.screenshots
  .map(
    (screenshot, index) =>
      `<img width="1280" alt="Screenshot ${index + 1}" src="${screenshot}" />`
  )
  .join("\n")}
`;
  };

  const downloadReadme = () => {
    const element = document.createElement("a");
    const file = new Blob([generateReadmeCode()], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = "README.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <main className="min-h-screen p-6 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          README Generator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="basic">
                <TabsList className="mb-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                  <TabsTrigger value="links">Links</TabsTrigger>
                </TabsList>

                <TabsContent value="basic">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Project Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="githubUsername">GitHub Username</Label>
                      <div className="flex gap-2">
                        <Input
                          id="githubUsername"
                          name="githubUsername"
                          value={formData.githubUsername}
                          onChange={handleInputChange}
                          placeholder="e.g. octocat"
                        />
                        <Button
                          variant="outline"
                          onClick={fetchGithubProfile}
                          disabled={formData.isLoading}
                        >
                          {formData.isLoading ? (
                            <ReloadIcon className="animate-spin mr-2" />
                          ) : (
                            <GitHubLogoIcon className="mr-2" />
                          )}
                          Fetch
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Badges</Label>
                      <div className="flex gap-2 mt-2">
                        <Badge
                          variant={
                            formData.badges.includes("PWA")
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => {
                            if (formData.badges.includes("PWA")) {
                              setFormData((prev) => ({
                                ...prev,
                                badges: prev.badges.filter((b) => b !== "PWA"),
                              }));
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                badges: [...prev.badges, "PWA"],
                              }));
                            }
                          }}
                        >
                          PWA
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="images">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="logo">Logo/Avatar Image</Label>
                      <div className="flex items-center gap-4 mt-2">
                        {formData.logoUrl && (
                          <div className="relative w-16 h-16 rounded-md overflow-hidden">
                            <img
                              src={formData.logoUrl}
                              alt="Logo preview"
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        <Input
                          id="logo"
                          name="logo"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="screenshot">Add Screenshots</Label>
                      <div className="mt-2">
                        <Input
                          id="screenshot"
                          name="screenshot"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </div>

                      {formData.screenshots.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          {formData.screenshots.map((screenshot, index) => (
                            <div
                              key={index}
                              className="relative aspect-video rounded-md overflow-hidden"
                            >
                              <img
                                src={screenshot}
                                alt={`Screenshot ${index + 1}`}
                                className="object-cover w-full h-full"
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    screenshots: prev.screenshots.filter(
                                      (_, i) => i !== index
                                    ),
                                  }));
                                }}
                              >
                                <Cross1Icon />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="links">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label>Custom Links</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addCustomLink}
                      >
                        <PlusIcon className="mr-1" /> Add Link
                      </Button>
                    </div>

                    {formData.customLinks.map((link, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <div className="flex-1">
                          <Input
                            value={link.label}
                            placeholder="Link Label"
                            onChange={(e) =>
                              handleCustomLinkChange(
                                index,
                                "label",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="flex-[2]">
                          <Input
                            value={link.url}
                            placeholder="URL"
                            onChange={(e) =>
                              handleCustomLinkChange(
                                index,
                                "url",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0"
                          onClick={() => removeCustomLink(index)}
                          disabled={formData.customLinks.length <= 1}
                        >
                          <Cross1Icon />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <Separator className="my-6" />

              <Button className="w-full" onClick={downloadReadme}>
                <DownloadIcon className="mr-2" />
                Download README.md
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex gap-2 items-center">
                <Badge variant="outline">
                  {previewMode === "preview"
                    ? "Markdown Preview"
                    : "Markdown Code"}
                </Badge>
                <div className="flex border rounded-md overflow-hidden">
                  <Button
                    variant={previewMode === "preview" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-none"
                    onClick={() => setPreviewMode("preview")}
                  >
                    <EyeOpenIcon className="mr-1 h-4 w-4" /> Preview
                  </Button>
                  <Button
                    variant={previewMode === "code" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-none"
                    onClick={() => setPreviewMode("code")}
                  >
                    <CodeIcon className="mr-1 h-4 w-4" /> Code
                  </Button>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Preview</h2>
                <Badge variant="outline">Markdown</Badge>
              </div>

              <div className="result bg-white dark:bg-slate-900 border rounded-md overflow-auto h-[70vh]">
                <div className="markdown-body p-4">
                  {previewMode === "preview" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        ),
                        h1: ({ node, ...props }) => (
                          <h1
                            {...props}
                            className="text-center text-3xl font-bold my-4"
                          />
                        ),
                        h4: ({ node, ...props }) => (
                          <h4
                            {...props}
                            className="text-center text-lg font-medium my-3"
                          />
                        ),
                        p: ({ node, children, ...props }) => {
                          const html = String(node?.children?.[0].data || "");
                          const isCenter = html.includes('align="center"');

                          return (
                            <p
                              {...props}
                              className={`${
                                isCenter ? "text-center" : ""
                              } my-3`}
                            >
                              {children}
                            </p>
                          );
                        },
                        img: ({ node, ...props }) => {
                          const isPWABadge =
                            props.src?.includes("pwa-shields.com");
                          const isScreenshot =
                            props.alt?.includes("Screenshot");
                          const isLogo = !isPWABadge && !isScreenshot;

                          let className = "mx-auto";
                          if (isPWABadge) {
                            className += " inline-block h-5";
                          } else if (isLogo) {
                            className += " w-32 h-32 object-contain";
                          } else if (isScreenshot) {
                            className += " w-full my-2 border rounded-md";
                          }

                          return <img {...props} className={className} />;
                        },
                      }}
                    >
                      {generateReadmeCode()}
                    </ReactMarkdown>
                  ) : (
                    <pre className="whitespace-pre-wrap font-mono text-sm p-4">
                      {generateReadmeCode()}
                    </pre>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
