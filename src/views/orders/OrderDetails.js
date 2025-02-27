// File: src/views/orders/OrderDetails.js

import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Badge,
  VStack,
  HStack,
  Container,
  Divider,
  Textarea,
  Heading,
  Icon,
  useColorModeValue,
  useToast,
  Spinner,
  Grid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Circle,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  RadioGroup,
  Radio,
  Checkbox,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaUser,
  FaInfoCircle,
  FaBoxOpen,
  FaShippingFast,
  FaMoneyBillWave,
  FaDownload,
  FaEnvelope,
  FaBell,
} from 'react-icons/fa';

// Context that provides orders, updateOrderStatus, sendFeedback, etc.
import { OrdersContext } from './components/OrdersContext';

// Components for UI
import TransitTimeline from './components/TransitTimeline';
import OrderNotifications from './components/OrderNotifications';

export default function OrderDetails() {
  // Extract `orderId` from URL Parameters
  const { orderId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  // Chakra UI Modal Controls
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Additional Modal Controls for Appraisal
  const [isAppraiseOpen, setIsAppraiseOpen] = useState(false);

  // Notification Drawer Controls
  const {
    isOpen: isNotificationsOpen,
    onOpen: onOpenNotifications,
    onClose: onCloseNotifications,
  } = useDisclosure();

  // Color mode styling
  const textColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  const sectionBg = useColorModeValue('gray.50', 'gray.700');
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Badge color schemes
  const badgeColorScheme = {
    Pending: 'yellow',
    Accepted: 'blue',
    'Handed Over': 'orange',
    Appraised: 'teal',
    Shipped: 'cyan',
    Delivered: 'green',
    Cancelled: 'red',
    Rejected: 'red',
  };

  // Consume OrdersContext to get data/functions
  const { ordersData, updateOrderStatus, sendFeedback, loading } = useContext(OrdersContext);

  // Local state to manage the current status
  const [status, setStatus] = useState('Pending');

  // Local State for appraisal result
  const [appraisedResult, setAppraisedResult] = useState('');

  // Local state for feedback form
  const [feedbackRecipient, setFeedbackRecipient] = useState({
    customer: true,
    seller: false,
  });
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackError, setFeedbackError] = useState('');

  // Stepper statuses
  const statuses = [
    { label: 'Pending', icon: FaInfoCircle },
    { label: 'Accepted', icon: FaCheckCircle },
    { label: 'Handed Over', icon: FaBoxOpen },
    { label: 'Appraised', icon: FaMoneyBillWave },
    { label: 'Shipped', icon: FaShippingFast },
    { label: 'Delivered', icon: FaCheckCircle },
  ];

  // Find the specific order by `orderId`
  const order = useMemo(() => {
    if (!Array.isArray(ordersData)) return null;
    const foundOrder = ordersData.find((o) => String(o.orderId) === String(orderId)) || {};
    return {
      ...foundOrder,
      notifications: Array.isArray(foundOrder.notifications)
        ? foundOrder.notifications
        : [],
    };
  }, [ordersData, orderId]);

  // Update status when the order data changes
  useEffect(() => {
    if (order) {
      setStatus(order.orderStatus || 'Pending');
    }
  }, [order]);

  // Determine which step is current
  const currentStatusIndex = statuses.findIndex((s) => s.label === status);
  const validatedStatusIndex = currentStatusIndex !== -1 ? currentStatusIndex : 0;

  // If data is still loading
  if (loading) {
    return (
      <Container maxW="container.lg" py="6">
        <Flex
          p="6"
          bg={cardBg}
          borderRadius="md"
          shadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
          align="center"
          justify="center"
          direction="column"
        >
          <Spinner size="xl" />
          <Text mt="4">Loading order details...</Text>
        </Flex>
      </Container>
    );
  }

  // If order not found
  if (!order) {
    return (
      <Container maxW="container.lg" py="6">
        <Flex
          p="6"
          bg={cardBg}
          borderRadius="md"
          shadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
          align="center"
          justify="center"
          direction="column"
        >
          <Icon as={FaTimesCircle} boxSize="50px" color="red.500" />
          <Text mt="4" fontSize="lg" fontWeight="bold" color="red.500">
            Order not found.
          </Text>
        </Flex>
      </Container>
    );
  }

  // --- ACTION HANDLERS ---
  const handleAcceptOrder = () => {
    if (!['Appraised', 'Shipped', 'Delivered'].includes(status)) {
      toast({
        title: 'Invalid Action.',
        description: 'Cannot accept order from the current status.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setStatus('Accepted');
    updateOrderStatus(orderId, 'Accepted');
    toast({
      title: 'Order Accepted.',
      description: 'You have accepted the order successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleRejectOrder = () => {
    if (!['Appraised', 'Shipped', 'Delivered'].includes(status)) {
      toast({
        title: 'Invalid Action.',
        description: 'Cannot reject order from the current status.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setStatus('Rejected');
    updateOrderStatus(orderId, 'Rejected');
    toast({
      title: 'Order Rejected.',
      description: 'You have rejected the order.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
    navigate('/orders');
  };

  const handleMarkAsHandedOver = () => {
    if (!['Appraised', 'Shipped', 'Delivered'].includes(status)) {
      toast({
        title: 'Invalid Action.',
        description: 'Cannot mark as handed over from the current status.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setStatus('Handed Over');
    updateOrderStatus(orderId, 'Handed Over');
    toast({
      title: 'Order Handed Over.',
      description: 'You have handed over the order.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Mark as Appraised
  const handleAppraisedStatus = () => {
    if (!['Appraised', 'Shipped', 'Delivered'].includes(status)) {
      toast({
        title: 'Invalid Action.',
        description: 'Cannot appraise order from the current status.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!appraisedResult) {
      toast({
        title: 'Select Appraisal Result.',
        description: 'Please select whether the order has passed or failed appraisal.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (appraisedResult === 'failed') {
      setStatus('Rejected');
      updateOrderStatus(orderId, 'Rejected');
      toast({
        title: 'Order Rejected.',
        description: 'The order failed appraisal and has been rejected.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setAppraisedResult('');
      setIsAppraiseOpen(false);
      navigate('/orders');
    } else {
      setStatus('Appraised');
      updateOrderStatus(orderId, 'Appraised', 'passed');
      toast({
        title: 'Order Appraised.',
        description: 'The order has passed appraisal and is ready to be shipped.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setAppraisedResult('');
      setIsAppraiseOpen(false);
    }
  };

  // Mark as Shipped
  const handleMarkAsShipped = () => {
    if (!['Appraised', 'Shipped', 'Delivered'].includes(status)) {
      toast({
        title: 'Invalid Action.',
        description: 'Cannot mark as shipped from the current status.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setStatus('Shipped');
    updateOrderStatus(orderId, 'Shipped');
    toast({
      title: 'Order Shipped.',
      description: 'The order has been marked as shipped.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Mark as Delivered
  const handleMarkAsDelivered = () => {
    if (!['Appraised', 'Shipped', 'Delivered'].includes(status)) {
      toast({
        title: 'Invalid Action.',
        description: 'Cannot mark as delivered from the current status.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setStatus('Delivered');
    updateOrderStatus(orderId, 'Delivered');
    toast({
      title: 'Order Delivered.',
      description: 'The order has been marked as delivered.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle feedback form submission
  const handleSendFeedback = () => {
    const { customer, seller } = feedbackRecipient;
    if (!customer && !seller) {
      setFeedbackError('Please select at least one recipient.');
      return;
    }
    if (feedbackMessage.trim() === '') {
      setFeedbackError('Feedback message cannot be empty.');
      return;
    }

    // Send feedback
    if (customer) sendFeedback(orderId, feedbackMessage, 'customer');
    if (seller) sendFeedback(orderId, feedbackMessage, 'seller');

    toast({
      title: 'Feedback Sent.',
      description: 'Your feedback has been sent successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    // Reset
    setFeedbackMessage('');
    setFeedbackRecipient({ customer: true, seller: false });
    setFeedbackError('');
    onClose();
  };

  return (
    <Container maxW="container.xl" py="6">
      <VStack spacing="8" align="stretch">
        {/* Top Bar (Order Info, Download Invoice, Feedback, Notifications) */}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          bg={sectionBg}
          p="6"
          borderRadius="md"
          boxShadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
          flexWrap="wrap"
        >
          <HStack spacing="4">
            <Badge colorScheme={badgeColorScheme[status]} px="3" py="1" borderRadius="full">
              {status}
            </Badge>
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              Order #{order.orderId}
            </Text>
            <Text color="gray.500">
              Placed on: {new Date(order.orderDate).toLocaleString()}
            </Text>
          </HStack>
          <HStack spacing="4" mt={{ base: '4', md: '0' }}>
            <Button
              leftIcon={<FaDownload />}
              colorScheme="blue"
              variant="outline"
              onClick={() => {
                toast({
                  title: 'Download Invoice.',
                  description: 'Invoice download functionality not implemented yet.',
                  status: 'info',
                  duration: 3000,
                  isClosable: true,
                });
              }}
            >
              Download Invoice
            </Button>
            <Button leftIcon={<FaEnvelope />} colorScheme="teal" onClick={onOpen}>
              Send Feedback
            </Button>
            <Button
              leftIcon={<FaBell />}
              colorScheme="purple"
              variant="solid"
              onClick={onOpenNotifications}
              aria-label="View Notifications"
            >
              Notifications
            </Button>
          </HStack>
        </Flex>

        {/* Progress Tracker (Stepper) */}
        <Box
          bg={sectionBg}
          p="6"
          borderRadius="md"
          boxShadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Flex justify="space-between" align="center" wrap="wrap" position="relative">
            {statuses.map((s, index) => (
              <Flex
                key={s.label}
                align="center"
                direction="column"
                flex="1"
                position="relative"
              >
                {/* Connector line between steps */}
                {index !== 0 && (
                  <Box
                    height="2px"
                    width="100%"
                    bg={index <= validatedStatusIndex ? 'green.500' : 'gray.300'}
                    position="absolute"
                    top="20px"
                    left="50%"
                    transform="translateX(-50%)"
                    zIndex="-1"
                  />
                )}
                {/* Step Icon */}
                <Box position="relative" zIndex="1">
                  <Circle
                    size="40px"
                    bg={
                      index <= validatedStatusIndex
                        ? badgeColorScheme[s.label]
                          ? `${badgeColorScheme[s.label]}.500`
                          : accentColor
                        : 'gray.300'
                    }
                    color="white"
                  >
                    <Icon as={s.icon} />
                  </Circle>
                  <Text
                    mt="2"
                    fontSize="sm"
                    textAlign="center"
                    color={index <= validatedStatusIndex ? textColor : 'gray.500'}
                    fontWeight={index === validatedStatusIndex ? 'bold' : 'normal'}
                  >
                    {s.label}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Flex>
        </Box>

        {/* Order Info (Customer, Shipping, Seller, Payment) */}
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="6">
          <VStack spacing="6" align="stretch">
            {/* Customer Info */}
            <Box
              bg={cardBg}
              p="6"
              borderRadius="md"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Flex align="center" mb="4">
                <Icon as={FaUser} boxSize="6" color={accentColor} mr="2" />
                <Heading as="h3" size="md" color={textColor}>
                  Customer Information
                </Heading>
              </Flex>
              <VStack align="start" spacing="3">
                <HStack>
                  <Text fontWeight="600" minW="150px">
                    Name:
                  </Text>
                  <Text>{order.customerName}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="600" minW="150px">
                    Email:
                  </Text>
                  <Text>{order.customerEmail}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="600" minW="150px">
                    Phone:
                  </Text>
                  <Text>{order.customerPhone}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="600" minW="150px">
                    Billing Address:
                  </Text>
                  <Text>{order.billingAddress}</Text>
                </HStack>
              </VStack>
            </Box>

            {/* Shipping Info */}
            <Box
              bg={cardBg}
              p="6"
              borderRadius="md"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Flex align="center" mb="4">
                <Icon as={FaShippingFast} boxSize="6" color={accentColor} mr="2" />
                <Heading as="h3" size="md" color={textColor}>
                  Shipping Information
                </Heading>
              </Flex>
              <VStack align="start" spacing="3">
                <HStack>
                  <Text fontWeight="600" minW="150px">
                    Shipping Address:
                  </Text>
                  <Text>{order.shippingAddress}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="600" minW="150px">
                    Shipping Method:
                  </Text>
                  <Text>{order.shippingMethod}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="600" minW="150px">
                    Delivery Instructions:
                  </Text>
                  <Text>{order.deliveryInstructions || 'N/A'}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="600" minW="150px">
                    Estimated Delivery Date:
                  </Text>
                  <Text>{order.estimatedDeliveryDate}</Text>
                </HStack>
              </VStack>
            </Box>

            {/* Seller Info */}
            <Box
              bg={cardBg}
              p="6"
              borderRadius="md"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Flex align="center" mb="4">
                <Icon as={FaUser} boxSize="6" color={accentColor} mr="2" />
                <Heading as="h3" size="md" color={textColor}>
                  Seller Information
                </Heading>
              </Flex>
              <VStack align="start" spacing="3">
                <HStack>
                  <Text fontWeight="600" minW="150px">
                    Seller Name:
                  </Text>
                  <Text>{order.sellerName}</Text>
                </HStack>
                {/* Add more seller details if needed */}
              </VStack>
            </Box>
          </VStack>

          <VStack spacing="6" align="stretch">
            {/* Payment Details */}
            <Box
              bg={cardBg}
              p="6"
              borderRadius="md"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Flex align="center" mb="4">
                <Icon as={FaMoneyBillWave} boxSize="6" color={accentColor} mr="2" />
                <Heading as="h3" size="md" color={textColor}>
                  Payment Details
                </Heading>
              </Flex>
              <VStack align="start" spacing="3">
                <HStack>
                  <Text fontWeight="600" minW="150px">
                    Transaction ID:
                  </Text>
                  <Text>{order.transactionId}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="600" minW="150px">
                    Payment Method:
                  </Text>
                  <Text>{order.paymentMethod}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="600" minW="150px">
                    Billing Address:
                  </Text>
                  <Text>{order.billingAddress}</Text>
                </HStack>
              </VStack>
            </Box>

            {/* Order Overview */}
            <Box
              bg={cardBg}
              p="6"
              borderRadius="md"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Flex align="center" mb="4">
                <Icon as={FaInfoCircle} boxSize="6" color={accentColor} mr="2" />
                <Heading as="h3" size="md" color={textColor}>
                  Order Overview
                </Heading>
              </Flex>
              <VStack align="start" spacing="3">
                <HStack>
                  <Text fontWeight="600" minW="150px">
                    Order Date:
                  </Text>
                  <Text>{new Date(order.orderDate).toLocaleString()}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="600" minW="150px">
                    Payment Status:
                  </Text>
                  <Badge colorScheme={badgeColorScheme[order.paymentStatus]}>
                    {order.paymentStatus}
                  </Badge>
                </HStack>
                <HStack>
                  <Text fontWeight="600" minW="150px">
                    Appraised Status:
                  </Text>
                  <Badge
                    colorScheme={
                      order.appraisedStatus === 'passed'
                        ? 'green'
                        : order.appraisedStatus === 'failed'
                        ? 'red'
                        : 'gray'
                    }
                  >
                    {order.appraisedStatus
                      ? order.appraisedStatus.charAt(0).toUpperCase() +
                        order.appraisedStatus.slice(1)
                      : 'N/A'}
                  </Badge>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </Grid>

        {/* Transit Timeline */}
        <TransitTimeline
          transitDetails={order.transitDetails}
          shipmentInfo={order.shipmentInfo}
        />

        {/* Items Ordered */}
        <Box
          bg={cardBg}
          p="6"
          borderRadius="md"
          boxShadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Flex align="center" mb="4">
            <Icon as={FaBoxOpen} boxSize="6" color={accentColor} mr="2" />
            <Heading as="h3" size="md" color={textColor}>
              Items Ordered
            </Heading>
          </Flex>
          <TableContainer>
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  <Th>Product Name</Th>
                  <Th>SKU</Th>
                  <Th isNumeric>Quantity</Th>
                  <Th isNumeric>Price per Unit</Th>
                  <Th isNumeric>Total Price</Th>
                </Tr>
              </Thead>
              <Tbody>
                {order.items.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.productName}</Td>
                    <Td>{item.sku}</Td>
                    <Td isNumeric>{item.quantity}</Td>
                    <Td isNumeric>${item.pricePerUnit.toFixed(2)}</Td>
                    <Td isNumeric>${item.totalPrice.toFixed(2)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        {/* Order Summary */}
        <Box
          bg={sectionBg}
          p="6"
          borderRadius="md"
          boxShadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Flex align="center" mb="4">
            <Icon as={FaMoneyBillWave} boxSize="6" color={accentColor} mr="2" />
            <Heading as="h3" size="md" color={textColor}>
              Order Summary
            </Heading>
          </Flex>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="4">
            <VStack align="start" spacing="3">
              <HStack>
                <Text fontWeight="600" minW="150px">
                  Subtotal:
                </Text>
                <Text>${order.subtotal.toFixed(2)}</Text>
              </HStack>
              <HStack>
                <Text fontWeight="600" minW="150px">
                  Shipping Charges:
                </Text>
                <Text>${order.shippingCharges.toFixed(2)}</Text>
              </HStack>
              <HStack>
                <Text fontWeight="600" minW="150px">
                  Taxes:
                </Text>
                <Text>${order.taxes.toFixed(2)}</Text>
              </HStack>
              <HStack>
                <Text fontWeight="600" minW="150px">
                  Discounts Applied:
                </Text>
                <Text>${order.discounts.toFixed(2)}</Text>
              </HStack>
            </VStack>
            <VStack align="end" spacing="3">
              <Divider />
              <HStack>
                <Text fontWeight="600" minW="150px" fontSize="lg">
                  Grand Total:
                </Text>
                <Text fontWeight="bold" fontSize="lg">
                  ${order.grandTotal.toFixed(2)}
                </Text>
              </HStack>
            </VStack>
          </Grid>
        </Box>

        {/* Feedback Modal */}
        <Modal
          isOpen={isOpen}
          onClose={() => {
            setFeedbackError('');
            onClose();
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Send Feedback</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isInvalid={feedbackError}>
                <FormLabel>Feedback Recipients</FormLabel>
                <Checkbox
                  isChecked={feedbackRecipient.customer}
                  onChange={(e) =>
                    setFeedbackRecipient({ ...feedbackRecipient, customer: e.target.checked })
                  }
                >
                  Customer
                </Checkbox>
                <Checkbox
                  isChecked={feedbackRecipient.seller}
                  onChange={(e) =>
                    setFeedbackRecipient({ ...feedbackRecipient, seller: e.target.checked })
                  }
                >
                  Seller
                </Checkbox>
              </FormControl>

              <FormControl mt="4" isInvalid={feedbackError}>
                <FormLabel>Feedback Message</FormLabel>
                <Textarea
                  placeholder="Type your feedback here..."
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  bg={inputBg}
                />
                {feedbackError && <FormErrorMessage>{feedbackError}</FormErrorMessage>}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSendFeedback}>
                Send
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setFeedbackError('');
                  onClose();
                }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Action Buttons (focus on final steps) */}
        <Flex justifyContent="flex-end" mt="4">
          {/* (Optional) Accept/Reject if in Pending */}
          {status === 'Pending' && (
            <>
              <Button
                colorScheme="green"
                leftIcon={<FaCheckCircle />}
                onClick={handleAcceptOrder}
                aria-label="Accept Order"
                mr="4"
              >
                Accept Order
              </Button>
              <Button
                colorScheme="red"
                leftIcon={<FaTimesCircle />}
                onClick={handleRejectOrder}
                aria-label="Reject Order"
              >
                Reject Order
              </Button>
            </>
          )}

          {/* Hand Over if in Accepted */}
          {status === 'Accepted' && (
            <Button
              colorScheme="orange"
              leftIcon={<FaArrowRight />}
              onClick={handleMarkAsHandedOver}
              aria-label="Mark as Handed Over"
            >
              Mark as Handed Over
            </Button>
          )}

          {/* Mark as Appraised if in Handed Over */}
          {status === 'Handed Over' && (
            <Button
              colorScheme="teal"
              leftIcon={<FaCheckCircle />}
              onClick={() => setIsAppraiseOpen(true)}
              aria-label="Appraise Order"
              mr="4"
            >
              Appraise Order
            </Button>
          )}

          {/* Mark as Shipped if in Appraised */}
          {status === 'Appraised' && (
            <Button
              colorScheme="cyan"
              leftIcon={<FaShippingFast />}
              onClick={handleMarkAsShipped}
              aria-label="Mark as Shipped"
              mr="4"
            >
              Mark as Shipped
            </Button>
          )}

          {/* Mark as Delivered if in Shipped */}
          {status === 'Shipped' && (
            <Button
              colorScheme="green"
              leftIcon={<FaCheckCircle />}
              onClick={handleMarkAsDelivered}
              aria-label="Mark as Delivered"
            >
              Mark as Delivered
            </Button>
          )}

          {/* Final or invalid states */}
          {['Delivered', 'Cancelled', 'Rejected'].includes(status) && (
            <Text fontSize="lg" fontWeight="bold" color="gray.500">
              Order is in the "{status}" stage. No further action is required.
            </Text>
          )}
        </Flex>

        {/* Modal for Appraising (Passed/Failed) */}
        <Modal isOpen={isAppraiseOpen} onClose={() => setIsAppraiseOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Appraise Order</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Appraisal Result</FormLabel>
                <RadioGroup onChange={setAppraisedResult} value={appraisedResult}>
                  <HStack spacing="24px">
                    <Radio value="passed">Passed</Radio>
                    <Radio value="failed">Failed</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" mr={3} onClick={handleAppraisedStatus}>
                Submit
              </Button>
              <Button variant="ghost" onClick={() => setIsAppraiseOpen(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Notifications Drawer */}
        <OrderNotifications
          isOpen={isNotificationsOpen}
          onClose={onCloseNotifications}
          notifications={Array.isArray(order.notifications) ? order.notifications : []}
        />
      </VStack>
    </Container>
  );
}
