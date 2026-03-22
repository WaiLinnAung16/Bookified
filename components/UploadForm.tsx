"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, ImageIcon, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { cn } from "@/lib/utils";

const MAX_PDF_BYTES = 50 * 1024 * 1024; // 50MB

const voiceOptions = [
  {
    group: "Male Voices",
    voices: [
      {
        id: "dave",
        name: "Dave",
        description: "Young male, British-Essex, casual & conversational.",
      },
      {
        id: "daniel",
        name: "Daniel",
        description: "Middle-aged male, British, authoritative but warm.",
      },
      {
        id: "chris",
        name: "Chris",
        description: "Male, casual & easy-going.",
      },
    ],
  },
  {
    group: "Female Voices",
    voices: [
      {
        id: "rachel",
        name: "Rachel",
        description: "Young female, American, calm & clear.",
      },
      {
        id: "sarah",
        name: "Sarah",
        description: "Young female, American, soft & approachable.",
      },
    ],
  },
] as const;

const voiceIds = voiceOptions.flatMap((g) => g.voices.map((v) => v.id));
type VoiceId = (typeof voiceIds)[number];

export const bookUploadSchema = z.object({
  pdfFile: z
    .instanceof(File)
    .refine((f) => f.size <= MAX_PDF_BYTES, "PDF must be 50MB or smaller")
    .refine((f) => f.type === "application/pdf", "File must be a PDF."),
  coverImage: z
    .instanceof(File)
    .optional()
    .refine(
      (f) => !f || f.type.startsWith("image/"),
      "Cover must be an image file.",
    ),
  title: z.string().min(1, "Title is required."),
  author: z.string().min(1, "Author name is required."),
  voice: z.enum(voiceIds as unknown as [VoiceId, ...VoiceId[]], {
    message: "Please choose an assistant voice.",
  }),
});

type BookUploadValues = z.infer<typeof bookUploadSchema>;

function UploadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<BookUploadValues>({
    resolver: zodResolver(bookUploadSchema),
    defaultValues: {
      pdfFile: undefined,
      coverImage: undefined,
      title: "",
      author: "",
      voice: "rachel",
    },
  });

  const pdfFile = form.watch("pdfFile");
  const coverImage = form.watch("coverImage");

  async function onSubmit(values: BookUploadValues) {
    if (!values.pdfFile) {
      form.setError("pdfFile", {
        message: "Please upload a PDF file.",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // TODO: call API to start synthesis
      await new Promise((r) => setTimeout(r, 2000));
      console.log(values);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="new-book-wrapper space-y-8"
        >
          {/* PDF file upload */}
          <FormField
            control={form.control}
            name="pdfFile"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Book PDF File</FormLabel>
                <div
                  className={cn(
                    "upload-dropzone border-2 border-dashed border-(--border-subtle)",
                    value && "upload-dropzone-uploaded",
                  )}
                  onClick={() => pdfInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      pdfInputRef.current?.click();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload PDF"
                >
                  <FormControl>
                    <input
                      {...field}
                      ref={pdfInputRef}
                      type="file"
                      accept="application/pdf"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onChange(file);
                      }}
                    />
                  </FormControl>
                    {value ? (
                      <div className="flex flex-col items-center justify-center gap-2 flex-1 w-full px-4">
                        <span className="upload-dropzone-text truncate max-w-full">
                          {value.name}
                        </span>
                        <button
                          type="button"
                          className="upload-dropzone-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            form.resetField("pdfFile");
                            if (pdfInputRef.current)
                              pdfInputRef.current.value = "";
                          }}
                          aria-label="Remove PDF"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="upload-dropzone-icon shrink-0" />
                        <span className="upload-dropzone-text">
                          Click to upload PDF
                        </span>
                        <span className="upload-dropzone-hint">
                          PDF file (max 50MB)
                        </span>
                      </>
                    )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cover image upload */}
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Cover Image (Optional)</FormLabel>
                <div
                  className={cn(
                    "upload-dropzone border-2 border-dashed border-(--border-subtle)",
                    value && "upload-dropzone-uploaded",
                  )}
                  onClick={() => coverInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      coverInputRef.current?.click();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload cover image"
                >
                  <FormControl>
                    <input
                      {...field}
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file ?? undefined);
                      }}
                    />
                  </FormControl>
                    {value ? (
                      <div className="flex flex-col items-center justify-center gap-2 flex-1 w-full px-4">
                        <span className="upload-dropzone-text truncate max-w-full">
                          {value.name}
                        </span>
                        <button
                          type="button"
                          className="upload-dropzone-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            form.setValue("coverImage", undefined);
                            if (coverInputRef.current)
                              coverInputRef.current.value = "";
                          }}
                          aria-label="Remove cover image"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="upload-dropzone-icon shrink-0" />
                        <span className="upload-dropzone-text">
                          Click to upload cover image
                        </span>
                        <span className="upload-dropzone-hint">
                          Leave empty to auto-generate from PDF
                        </span>
                      </>
                    )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <input
                    className="form-input"
                    placeholder="ex: Rich Dad Poor Dad"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Author */}
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author Name</FormLabel>
                <FormControl>
                  <input
                    className="form-input"
                    placeholder="ex: Robert Kiyosaki"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Voice selector */}
          <FormField
            control={form.control}
            name="voice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Choose Assistant Voice</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {voiceOptions.map((group) => (
                      <div key={group.group}>
                        <p className="text-sm font-medium text-(--text-secondary) mb-2">
                          {group.group}
                        </p>
                        <div className="voice-selector-options flex flex-col sm:flex-row gap-4">
                          {group.voices.map((voice) => (
                            <label
                              key={voice.id}
                              className={cn(
                                "voice-selector-option flex flex-col items-start gap-1 p-4 min-w-0",
                                field.value === voice.id
                                  ? "voice-selector-option-selected"
                                  : "voice-selector-option-default",
                              )}
                            >
                              <div className="flex items-center gap-2 w-full">
                                <input
                                  type="radio"
                                  name={field.name}
                                  value={voice.id}
                                  checked={field.value === voice.id}
                                  onChange={() => field.onChange(voice.id)}
                                  className="sr-only"
                                />
                                <span className="font-semibold text-(--text-primary)">
                                  {voice.name}
                                </span>
                              </div>
                              <span className="text-sm text-(--text-secondary)">
                                {voice.description}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="form-btn" disabled={isSubmitting}>
            Begin Synthesis
          </Button>
        </form>
      </Form>

      <LoadingOverlay show={isSubmitting} title="Starting synthesis…" />
    </>
  );
}

export default UploadForm;
