'use client';

import { useState, useCallback, useRef } from 'react';
import Papa from 'papaparse';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, CheckCircle, X } from 'lucide-react';

export function CsvUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback((file: File) => {
    // Basic validation
    if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Por favor, envie apenas arquivos CSV.');
      return;
    }

    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log('CSV Convertido para JSON:', results.data);
        toast.success('Arquivo processado com sucesso!', {
          description: 'Verifique o console do navegador para ver o JSON.',
        });
        if (results.errors.length > 0) {
          console.warn('Avisos durante o parsing:', results.errors);
          toast.warning('O arquivo foi processado com alguns avisos.', {
             description: 'Verifique o console para detalhes.'
          });
        }
      },
      error: (error: Error) => {
        console.error('Erro ao ler o arquivo:', error);
        toast.error('Erro ao processar o arquivo CSV.');
      }
    });
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full max-w-4xl shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Upload de CSV</CardTitle>
        <CardDescription>
          Arraste e solte seu arquivo aqui ou clique para selecionar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={handleClick}
          className={`
            relative w-full h-32 border-2 border-dashed rounded-xl flex flex-row items-center justify-center cursor-pointer transition-all duration-300 ease-in-out gap-6
            ${isDragging 
              ? 'border-primary bg-primary/5 scale-[1.02]' 
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
            }
          `}
        >
          <Input
            type="file"
            ref={fileInputRef}
            onChange={onFileSelect}
            accept=".csv"
            className="hidden"
          />
          
          <div className={`p-4 rounded-full transition-colors duration-300 ${isDragging ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
            <Upload className="h-8 w-8" />
          </div>
          
          <div className="text-left">
            <p className="text-lg font-medium text-foreground">
              {fileName ? `Arquivo selecionado` : 'Solte seu arquivo CSV aqui'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {fileName ? fileName : 'ou clique para navegar'}
            </p>
          </div>
        </div>

        {fileName && (
          <div className="mt-6 p-4 bg-green-50/50 border border-green-200 rounded-lg flex items-center justify-between text-green-700 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Upload concluído!</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-green-700 hover:text-green-800 hover:bg-green-100"
              onClick={clearFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
