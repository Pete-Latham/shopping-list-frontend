/**
 * Touch detection utility for better mobile-first UX
 * Helps differentiate between touch and mouse interactions
 */

export class TouchDetection {
  private static instance: TouchDetection;
  private isTouchDevice = false;
  private hasMouseMoved = false;

  private constructor() {
    this.init();
  }

  public static getInstance(): TouchDetection {
    if (!TouchDetection.instance) {
      TouchDetection.instance = new TouchDetection();
    }
    return TouchDetection.instance;
  }

  private init(): void {
    this.detectTouchCapability();
    this.setupEventListeners();
  }

  private detectTouchCapability(): void {
    // Check for touch capability
    this.isTouchDevice = (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore - for older browsers
      navigator.msMaxTouchPoints > 0
    );
    
    // Add initial class to document
    this.updateDocumentClasses();
  }

  private setupEventListeners(): void {
    // Listen for first mouse movement to detect mouse users
    const handleMouseMove = () => {
      if (!this.hasMouseMoved && !this.isTouchDevice) {
        this.hasMouseMoved = true;
        document.documentElement.classList.add('mouse-user');
        document.removeEventListener('mousemove', handleMouseMove);
      }
    };

    // Listen for touch to confirm touch device
    const handleTouch = () => {
      this.isTouchDevice = true;
      this.updateDocumentClasses();
      document.removeEventListener('touchstart', handleTouch);
    };

    if (typeof window !== 'undefined') {
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('touchstart', handleTouch, { passive: true });
    }
  }

  private updateDocumentClasses(): void {
    if (typeof document === 'undefined') return;

    const htmlElement = document.documentElement;
    
    if (this.isTouchDevice) {
      htmlElement.classList.add('touch-device');
      htmlElement.classList.remove('no-touch');
    } else {
      htmlElement.classList.add('no-touch');
      htmlElement.classList.remove('touch-device');
    }
  }

  public getIsTouchDevice(): boolean {
    return this.isTouchDevice;
  }

  public getHasMouseMoved(): boolean {
    return this.hasMouseMoved;
  }
}

// Initialize touch detection when module loads
if (typeof window !== 'undefined') {
  TouchDetection.getInstance();
}

export default TouchDetection;
