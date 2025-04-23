from PIL import Image
import os

def get_image_dimensions(image_path):
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            return width, height
    except Exception as e:
        print(f"Errore nell'apertura dell'immagine {image_path}: {str(e)}")
        return None, None

def main():
    # Directory contenente le immagini
    image_dir = "."
    
    # Elenco di estensioni di file immagine supportate
    image_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.bmp')
    
    # Scansiona la directory
    for filename in os.listdir(image_dir):
        if filename.lower().endswith(image_extensions):
            image_path = os.path.join(image_dir, filename)
            width, height = get_image_dimensions(image_path)
            if width and height:
                print(f"Immagine: {filename}")
                print(f"Dimensioni: {width}x{height} pixel")
                print("-" * 50)

if __name__ == "__main__":
    main() 