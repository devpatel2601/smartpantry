export type Routes = {
    PermissionsPage: undefined
    CameraPage: undefined
    CodeScannerPage: undefined
    MediaPage: {
      path: string
      type: 'video' | 'photo'
    }
    Devices: undefined
    AddItem: { pantryItem: { name: string; brand: string; ingredients: string;  expiryDate: null; quantity: number; price: number; userId: string | null } };
  }