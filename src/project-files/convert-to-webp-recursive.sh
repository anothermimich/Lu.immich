#!/bin/bash

# Função para converter imagens para .webp redimensionado e apagar a original
process_image() {
  local file="$1"
  local dir=$(dirname "$file")
  local name=$(basename "$file")
  local filename="${name%.*}"
  local output_path="${dir}/${filename}.webp"

  convert "$file" -resize 1280x1280\> "$output_path"
  if [ $? -eq 0 ]; then
    echo "✅ Convertido: $file -> $output_path"
    rm "$file" # Remove a imagem original após o sucesso
  else
    echo "❌ Falha ao converter: $file"
  fi
}

# Encontra e processa apenas arquivos .jpg, .jpeg e .png
find . -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) | while read -r file; do
  extension="${file##*.}"
  case "${extension,,}" in
    jpg|jpeg|png)
      process_image "$file"
      ;;
    *)
      # Ignora silenciosamente outros formatos
      ;;
  esac
done