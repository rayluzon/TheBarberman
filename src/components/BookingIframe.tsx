import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Phone, Wifi, WifiOff, Shield } from 'lucide-react';

interface BookingIframeProps {
  bookingUrl: string;
  serviceName: string;
  onClose: () => void;
}

const BookingIframe: React.FC<BookingIframeProps> = ({ bookingUrl, serviceName, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Prevent body scroll when iframe modal is open
    document.body.classList.add('iframe-modal-open');
    
    // Enhanced iOS Safari & Android optimizations
    const viewport = document.querySelector('meta[name=viewport]');
    const originalContent = viewport?.getAttribute('content');
    if (viewport) {
      // Apple & Android optimized viewport
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, shrink-to-fit=no');
    }
    
    // Enhanced timeout for Apple & Android compatibility
    loadTimeoutRef.current = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 20000); // 20 second timeout for mobile devices

    // Enhanced height calculation for Apple & Android devices
    const updateHeights = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const headerHeight = 48; // Minimal header height
      
      // ENHANCED: Perfect full screen for Apple & Android
      const availableHeight = vh - headerHeight; // Only header space on all devices
      
      if (containerRef.current) {
        containerRef.current.style.height = `${availableHeight}px`;
        containerRef.current.style.maxHeight = `${availableHeight}px`;
        containerRef.current.style.minHeight = `${availableHeight}px`;
        containerRef.current.style.width = `${vw}px`;
        containerRef.current.style.maxWidth = `${vw}px`;
        containerRef.current.style.minWidth = `${vw}px`;
        // Apple specific optimizations
        containerRef.current.style.webkitTransform = 'translate3d(0, 0, 0)';
        containerRef.current.style.transform = 'translate3d(0, 0, 0)';
      }
      
      if (iframeRef.current) {
        iframeRef.current.style.height = `${availableHeight}px`;
        iframeRef.current.style.minHeight = `${availableHeight}px`;
        iframeRef.current.style.maxHeight = `${availableHeight}px`;
        iframeRef.current.style.width = `${vw}px`;
        iframeRef.current.style.minWidth = `${vw}px`;
        iframeRef.current.style.maxWidth = `${vw}px`;
        // Apple & Android iframe optimizations
        iframeRef.current.style.webkitTransform = 'translate3d(0, 0, 0)';
        iframeRef.current.style.transform = 'translate3d(0, 0, 0)';
        iframeRef.current.style.webkitBackfaceVisibility = 'hidden';
        iframeRef.current.style.backfaceVisibility = 'hidden';
      }
    };

    // Initial height calculation
    updateHeights();

    // Enhanced resize handling for Apple & Android
    const handleResize = () => {
      // Immediate update for better responsiveness
      updateHeights();
      // Additional update after delay for iOS keyboard
      setTimeout(updateHeights, 150);
    };

    // Enhanced event listeners for Apple & Android
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    // Apple specific events
    window.addEventListener('scroll', updateHeights, { passive: true });
    document.addEventListener('touchstart', updateHeights, { passive: true });

    return () => {
      document.body.classList.remove('iframe-modal-open');
      
      // Restore original viewport
      if (viewport && originalContent) {
        viewport.setAttribute('content', originalContent);
      }
      
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }

      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('scroll', updateHeights);
      document.removeEventListener('touchstart', updateHeights);
    };
  }, [isLoading]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    // Ensure iframe takes full available height after load
    if (iframeRef.current && containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const containerWidth = containerRef.current.clientWidth;
      iframeRef.current.style.height = `${containerHeight}px`;
      iframeRef.current.style.minHeight = `${containerHeight}px`;
      iframeRef.current.style.maxHeight = `${containerHeight}px`;
      iframeRef.current.style.width = `${containerWidth}px`;
      iframeRef.current.style.minWidth = `${containerWidth}px`;
      iframeRef.current.style.maxWidth = `${containerWidth}px`;
      // Apple & Android optimizations
      iframeRef.current.style.webkitTransform = 'translate3d(0, 0, 0)';
      iframeRef.current.style.transform = 'translate3d(0, 0, 0)';
    }
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
  };

  const handleFallbackBooking = () => {
    // Enhanced Apple & Android compatible external link opening
    try {
      // Method 1: Try window.open with Apple & Android optimized parameters
      const newWindow = window.open(
        bookingUrl, 
        '_blank', 
        'noopener,noreferrer,width=390,height=844,scrollbars=yes,resizable=yes,status=no,toolbar=no,menubar=no'
      );
      
      // Method 2: Enhanced fallback for mobile browsers
      setTimeout(() => {
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          window.location.href = bookingUrl;
        }
      }, 200);
    } catch (error) {
      // Enhanced fallback: Direct navigation for WebView/TWA/PWA
      window.location.href = bookingUrl;
    }
    onClose();
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    
    // Enhanced reload with cache busting for Apple & Android
    if (iframeRef.current) {
      const url = new URL(bookingUrl);
      url.searchParams.set('_t', Date.now().toString());
      url.searchParams.set('mobile', '1');
      url.searchParams.set('app', 'pwa');
      iframeRef.current.src = url.toString();
    }
  };

  // Enhanced postMessage handling for Apple & Android compatibility
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Enhanced security: Only accept messages from BokaDirekt domain
      if (!event.origin.includes('bokadirekt.se')) return;
      
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        // Enhanced navigation events for mobile devices
        if (data?.type === 'navigation' && data?.url) {
          console.log('Mobile iframe navigation detected:', data.url);
        }
        
        // Enhanced completion events
        if (data?.type === 'booking_complete') {
          console.log('Mobile booking completed successfully');
          // Enhanced success handling for mobile
        }
        
        // Apple & Android specific events
        if (data?.type === 'resize' && data?.height) {
          // Dynamic height adjustment for mobile
          if (iframeRef.current) {
            const newHeight = Math.min(data.height, window.innerHeight - 48);
            iframeRef.current.style.height = `${newHeight}px`;
          }
        }
      } catch (error) {
        console.log('Error parsing mobile postMessage:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Enhanced touch handling for Apple & Android
  const handleTouchStart = (e: React.TouchEvent) => {
    // Enhanced touch event handling for mobile devices
    e.stopPropagation();
    // Additional Apple optimizations
    if (e.touches.length > 1) {
      e.preventDefault(); // Prevent pinch zoom
    }
  };

  // Enhanced touch move handling for Apple devices
  const handleTouchMove = (e: React.TouchEvent) => {
    // Allow iframe scrolling but prevent page scrolling
    if (e.target === containerRef.current) {
      e.preventDefault();
    }
  };

  // Animation variants
  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: 50
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      y: 50,
      transition: {
        duration: 0.3
      }
    }
  };

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        delay: 0.1
      }
    }
  };

  const loadingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <AnimatePresence>
      {/* Full Screen Modal Overlay - Maximum Z-Index */}
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 flex flex-col"
        style={{ 
          zIndex: 9999999,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
          // Enhanced Apple & Android optimizations
          WebkitTransform: 'translate3d(0, 0, 0)',
          transform: 'translate3d(0, 0, 0)',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden'
        }}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header with Maximum Z-Index */}
        <motion.div 
          className="bg-gradient-to-r from-[#F4A300] via-[#f5a623] to-[#e6930a] text-white px-4 py-2 flex items-center justify-between shadow-lg h-12 flex-shrink-0"
          style={{ 
            zIndex: 10000000,
            position: 'relative',
            width: '100%',
            // Enhanced Apple & Android header optimizations
            WebkitTransform: 'translate3d(0, 0, 0)',
            transform: 'translate3d(0, 0, 0)'
          }}
          variants={headerVariants}
        >
          <div className="flex items-center min-w-0 flex-1">
            <motion.img 
              src="/barberman-logo.png" 
              alt="Logo" 
              className="w-6 h-6 mr-2 rounded-full bg-white p-0.5 flex-shrink-0"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            />
            <div className="min-w-0 flex-1">
              <motion.h2 
                className="font-bold text-xs truncate"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Säker bokning
              </motion.h2>
              <motion.p 
                className="text-xs opacity-90 flex items-center truncate"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 0.9 }}
                transition={{ delay: 0.3 }}
              >
                <Shield size={10} className="mr-1 flex-shrink-0" />
                <span className="truncate">{serviceName}</span>
              </motion.p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
            {/* Animated Online/Offline indicator */}
            <motion.div 
              className="flex items-center"
              animate={{
                scale: isOnline ? [1, 1.2, 1] : 1,
                opacity: isOnline ? [1, 0.7, 1] : 0.5
              }}
              transition={{
                duration: 2,
                repeat: isOnline ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              {isOnline ? (
                <Wifi size={14} className="text-green-300" />
              ) : (
                <WifiOff size={14} className="text-red-300" />
              )}
            </motion.div>
            <motion.button
              onClick={onClose}
              className="p-1.5 hover:bg-black hover:bg-opacity-20 rounded-full transition-colors flex-shrink-0"
              aria-label="Stäng bokning"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <X size={18} />
            </motion.button>
          </div>
        </motion.div>

        {/* Full-Screen Content Area */}
        <motion.div 
          ref={containerRef}
          className="flex-1 relative bg-white overflow-hidden iframe-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          style={{ 
            // Enhanced dynamic height for Apple & Android
            height: 'calc(100vh - 48px)', // Default desktop
            maxHeight: 'calc(100vh - 48px)',
            minHeight: 'calc(100vh - 48px)',
            width: '100vw',
            maxWidth: '100vw',
            minWidth: '100vw',
            zIndex: 9999998,
            position: 'relative',
            // Enhanced Apple & Android container optimizations
            WebkitTransform: 'translate3d(0, 0, 0)',
            transform: 'translate3d(0, 0, 0)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            contain: 'layout style paint'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {/* Loading State */}
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-white"
                style={{ zIndex: 9999999 }}
                variants={loadingVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="text-center px-4">
                  <motion.div 
                    className="w-10 h-10 border-b-2 border-[#F4A300] rounded-full mx-auto mb-3"
                    animate={{ rotate: 360 }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <motion.p 
                    className="text-gray-600 text-sm"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Laddar säker bokning...
                  </motion.p>
                  <motion.p 
                    className="text-gray-400 text-xs mt-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Ansluter till BokaDirekt
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Offline State */}
          <AnimatePresence>
            {!isOnline && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-white p-4"
                style={{ zIndex: 9999999 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="text-center max-w-sm">
                  <motion.div
                    animate={{ 
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <WifiOff size={40} className="text-gray-400 mx-auto mb-3" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Ingen internetanslutning
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Kontrollera din internetanslutning och försök igen.
                  </p>
                  <div className="space-y-3">
                    <motion.button
                      onClick={handleRetry}
                      className="w-full bg-[#F4A300] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#e6930a] transition-colors disabled:opacity-50"
                      disabled={!isOnline}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Försök igen
                    </motion.button>
                    <div className="flex items-center justify-center text-gray-600 text-sm">
                      <Phone size={16} className="mr-2" />
                      <span>Ring: 073-554 58 82</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State */}
          <AnimatePresence>
            {hasError && isOnline && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-white p-4"
                style={{ zIndex: 9999999 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="text-center max-w-sm">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, -5, 5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Kunde inte ladda bokning
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Detta kan bero på säkerhetsinställningar i din webbläsare eller tillfälliga problem med BokaDirekt. 
                    Försök igen eller öppna bokningen i Safari.
                  </p>
                  <div className="space-y-3">
                    <motion.button
                      onClick={handleRetry}
                      className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Försök igen
                    </motion.button>
                    <motion.button
                      onClick={handleFallbackBooking}
                      className="w-full bg-[#F4A300] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#e6930a] transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Öppna i Safari
                    </motion.button>
                    <div className="flex items-center justify-center text-gray-600 text-sm">
                      <Phone size={16} className="mr-2" />
                      <span>Eller ring: 073-554 58 82</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Full-Screen Iframe */}
          {isOnline && (
            <motion.iframe
              ref={iframeRef}
              src={bookingUrl}
              className="w-full border-0 bg-white block"
              style={{ 
                height: '100%',
                minHeight: '100%',
                maxHeight: '100%',
                width: '100%',
                minWidth: '100%',
                maxWidth: '100%',
                zIndex: 9999997,
                position: 'relative',
                // Enhanced Apple & Android iframe optimizations
                WebkitOverflowScrolling: 'touch',
                overflow: 'auto',
                WebkitTransform: 'translate3d(0, 0, 0)',
                transform: 'translate3d(0, 0, 0)',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden',
                contain: 'layout style paint',
                willChange: 'transform'
              }}
              // Enhanced security sandbox for Apple & Android compatibility
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
              scrolling="auto"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title={`Säker bokning - ${serviceName}`}
              loading="lazy"
              // Enhanced Apple & Android specific attributes
              allow="payment; geolocation"
              referrerPolicy="strict-origin-when-cross-origin"
              // Accessibility
              aria-label={`Bokningsformulär för ${serviceName}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoading ? 0 : 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingIframe;