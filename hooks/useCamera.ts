import { useState, useRef } from 'react';
import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';

export type UseCameraReturn = {
  facing: CameraType;
  permission: ReturnType<typeof useCameraPermissions>[0];
  requestPermission: ReturnType<typeof useCameraPermissions>[1];
  showCamera: boolean;
  photo: string | null;
  cameraRef: React.RefObject<CameraView>;
  toggleCameraFacing: () => void;
  takePicture: () => Promise<void>;
  setShowCamera: (show: boolean) => void;
  setPhoto: (photo: string | null) => void;
}

export function useCamera(): UseCameraReturn {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photoData: CameraCapturedPicture | undefined = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: false,
      });

      if (photoData) {
        setPhoto(photoData.uri);
        console.log('Photo Taken: ', photoData.uri);
      } else {
        console.warn('Failed to take picture: photoData is undefined');
      }
    }
  };

  return {
    facing,
    permission,
    requestPermission,
    showCamera,
    photo,
    cameraRef,
    toggleCameraFacing,
    takePicture,
    setShowCamera,
    setPhoto,
  };
}
