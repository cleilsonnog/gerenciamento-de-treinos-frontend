"use client";

import Image from "next/image";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";

type ExerciseDbResult = {
  exerciseId: string;
  name: string;
  gifUrl: string;
};

interface ExerciseSearchProps {
  onSelect: (result: { name: string; gifUrl: string }) => void;
  selectedGifUrl?: string | null;
  onClear: () => void;
}

export function ExerciseSearch({
  onSelect,
  selectedGifUrl,
  onClear,
}: ExerciseSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ExerciseDbResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const controller = new AbortController();

    const fetchResults = async () => {
      setIsSearching(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/exercises/search?q=${encodeURIComponent(debouncedQuery)}`;
        const response = await fetch(url, {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Search failed");

        const data = (await response.json()) as ExerciseDbResult[];
        setResults(data);
        setShowResults(true);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();

    return () => controller.abort();
  }, [debouncedQuery]);

  const handleSelect = (result: ExerciseDbResult) => {
    onSelect({ name: result.name, gifUrl: result.gifUrl });
    setQuery("");
    setShowResults(false);
  };

  if (selectedGifUrl) {
    return (
      <div className="flex items-center gap-3 rounded-md border p-2">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
          <Image
            src={selectedGifUrl}
            alt="GIF do exercício"
            fill
            sizes="64px"
            className="object-contain"
            unoptimized
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-sm text-muted-foreground">GIF selecionado</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={onClear}
          >
            <X className="mr-1 h-3 w-3" />
            Remover
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar exercício na ExerciseDB (em inglês)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {isSearching && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {showResults && !isSearching && results.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum exercício encontrado.
        </p>
      )}

      {showResults && results.length > 0 && (
        <div className="max-h-60 space-y-1 overflow-y-auto rounded-md border p-1">
          {results.map((result) => (
            <button
              key={result.exerciseId}
              type="button"
              className="flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-accent"
              onClick={() => handleSelect(result)}
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-muted">
                <Image
                  src={result.gifUrl}
                  alt={result.name}
                  fill
                  sizes="48px"
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-sm font-medium capitalize">
                {result.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
