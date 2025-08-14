import { useState, useEffect } from 'react';

const UnsplashPicker = ({ position, onClose, onSelectImage }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchImages = async (pageNum = 1, search = '') => {
    setLoading(true);
    try {
      const imageCount = 9;
      
      // Different image sets based on search terms
      const imageCollections = {
        nature: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
        people: [64, 65, 91, 177, 188, 203, 227, 249, 287, 309, 338, 342, 399, 433, 494, 548, 669, 683],
        technology: [0, 60, 180, 326, 518, 537, 550, 577, 606, 665, 689, 758, 804, 846, 870, 901, 942, 971],
        city: [26, 39, 45, 51, 78, 96, 102, 109, 122, 164, 193, 225, 244, 274, 304, 318, 365, 381],
        food: [23, 61, 81, 96, 137, 156, 162, 174, 196, 214, 225, 284, 292, 312, 361, 376, 431, 459],
        business: [7, 29, 46, 58, 89, 119, 152, 184, 211, 238, 267, 295, 324, 353, 382, 415, 448, 477],
        travel: [13, 25, 47, 72, 83, 115, 147, 179, 206, 234, 262, 290, 319, 347, 375, 408, 440, 472],
        art: [104, 113, 141, 169, 201, 232, 260, 288, 316, 344, 372, 405, 437, 469, 501, 533, 565, 597],
        animals: [169, 200, 237, 268, 296, 325, 354, 383, 416, 449, 478, 507, 536, 567, 598, 629, 660, 691],
        default: [1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180]
      };
      
      // Determine which image set to use based on search term
      let selectedCollection = imageCollections.default;
      const searchLower = search.toLowerCase().trim();
      
      if (searchLower) {
        if (searchLower.includes('nature') || searchLower.includes('landscape') || searchLower.includes('forest') || searchLower.includes('mountain')) {
          selectedCollection = imageCollections.nature;
        } else if (searchLower.includes('people') || searchLower.includes('person') || searchLower.includes('human') || searchLower.includes('portrait')) {
          selectedCollection = imageCollections.people;
        } else if (searchLower.includes('tech') || searchLower.includes('computer') || searchLower.includes('phone') || searchLower.includes('digital')) {
          selectedCollection = imageCollections.technology;
        } else if (searchLower.includes('city') || searchLower.includes('urban') || searchLower.includes('building') || searchLower.includes('street')) {
          selectedCollection = imageCollections.city;
        } else if (searchLower.includes('food') || searchLower.includes('eat') || searchLower.includes('drink') || searchLower.includes('coffee')) {
          selectedCollection = imageCollections.food;
        } else if (searchLower.includes('business') || searchLower.includes('office') || searchLower.includes('work') || searchLower.includes('meeting')) {
          selectedCollection = imageCollections.business;
        } else if (searchLower.includes('travel') || searchLower.includes('vacation') || searchLower.includes('trip') || searchLower.includes('destination')) {
          selectedCollection = imageCollections.travel;
        } else if (searchLower.includes('art') || searchLower.includes('creative') || searchLower.includes('design') || searchLower.includes('paint')) {
          selectedCollection = imageCollections.art;
        } else if (searchLower.includes('animal') || searchLower.includes('dog') || searchLower.includes('cat') || searchLower.includes('pet')) {
          selectedCollection = imageCollections.animals;
        }
      }
      
      const generatedImages = Array.from({ length: imageCount }, (_, index) => {
        const imageIndex = ((pageNum - 1) * imageCount + index) % selectedCollection.length;
        const imageId = selectedCollection[imageIndex];
        
        return {
          id: `image-${imageId}-${search}`,
          urls: {
            small: `https://picsum.photos/id/${imageId}/400/300`,
            regular: `https://picsum.photos/id/${imageId}/800/600`,
            full: `https://picsum.photos/id/${imageId}/1200/800`
          },
          alt_description: search ? `${search} photo ${imageId}` : `Photo ${imageId}`,
          author: 'Picsum Photos',
          download_url: `https://picsum.photos/id/${imageId}/800/600`,
          width: 800,
          height: 600
        };
      });
      
      if (pageNum === 1) {
        setImages(generatedImages);
        console.log('Generated images for search:', search, 'using collection:', selectedCollection);
      } else {
        setImages(prev => [...prev, ...generatedImages]);
      }
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchImages(1, searchTerm);
      setPage(1);
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchImages(1, searchTerm);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(nextPage, searchTerm);
  };

  const handleImageSelect = (image) => {
    console.log('Image selected:', image.urls.regular);
    // Test the image URL before passing it
    const testImg = new Image();
    testImg.onload = () => {
      console.log('Image URL is valid, inserting into editor');
      onSelectImage(image.urls.regular);
      onClose();
    };
    testImg.onerror = () => {
      console.log('Image URL failed, trying fallback');
      // Try a simpler URL format as fallback
      const fallbackUrl = `https://picsum.photos/800/600?${Date.now()}`;
      onSelectImage(fallbackUrl);
      onClose();
    };
    testImg.src = image.urls.regular;
  };

  return (
    <div
      className="fixed inset-0 bg-white bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-[90vw] max-w-5xl h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Unsplash branding and search */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-full flex justify-end items-center gap-3">
              
              <button
                onClick={onClose}
                className="ml-auto text-gray-400 hover:text-gray-600 text-2xl font-light"
              >
                ×
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search free high-resolution photos"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent text-base"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </form>
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && images.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-gray-500">Loading images...</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-[4/3] cursor-pointer group overflow-hidden rounded-lg bg-gray-200"
                    onClick={() => handleImageSelect(image)}
                  >
                    <img
                      src={image.urls.small}
                      alt={image.alt_description}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        console.log('Image failed to load:', e.target.src);
                        e.target.src = `https://picsum.photos/400/300?${Math.floor(Math.random() * 1000)}`;
                      }}
                      onLoad={(e) => {
                        console.log('Image loaded successfully:', e.target.src);
                      }}
                    />
                    {/* Hover overlay */}
                   
                  </div>
                ))}
              </div>
              
              {/* Load More Button */}
              {images.length > 0 && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Loading...' : 'Load more photos'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnsplashPicker;
