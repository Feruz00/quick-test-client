import { Modal, Button, QRCode } from 'antd';
import { useMemo, useRef } from 'react';
import { Link } from 'react-router';
import { DownloadOutlined } from '@ant-design/icons';

const QrCodeShowModal = ({ open, onCancel, joinCode }) => {
  const qrRef = useRef(null);

  const address = useMemo(() => {
    const url = new URL(window.location.href);
    url.pathname = `/join/${joinCode}`;
    url.search = '';
    url.hash = '';
    return url.toString();
  }, [joinCode]);

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');

    if (!canvas) return;

    const url = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = url;
    link.download = `competition-qr-${joinCode}.png`;
    link.click();
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      centered
      width="xl"
      title={
        <span className="text-lg font-semibold">
          Join to competition with QR Code
        </span>
      }
    >
      <div className="flex flex-col items-center gap-4 mt-4">
        <div ref={qrRef}>
          <QRCode value={address} size={250} />
        </div>

        <div className="flex gap-3 justify-between w-full">
          {import.meta.env.DEV && (
            <>
              <Link to={address} className="text-blue-500 hover:underline">
                Manual go
              </Link>
            </>
          )}

          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
          >
            Download QR
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default QrCodeShowModal;
